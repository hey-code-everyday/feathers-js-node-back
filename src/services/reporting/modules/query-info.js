//right now this handles just daily (one day back)
//later we will modify by passing a dynamic interval param to pass to the queries dynamically
/*eslint-disable */
const groupBy = require('lodash/groupBy');
const moment = require('moment');

module.exports = async (params, interval, app) => {

  let query_interval;
  if(interval === 'DAILY'){
    query_interval = '= DATE(NOW() - INTERVAL 1 DAY)';
  }
  if(interval === 'WEEKLY'){
    query_interval = '>= DATE(NOW() - INTERVAL 1 WEEK)';
  }
  if(interval === 'MONTHLY'){
    query_interval = '>= DATE(NOW() - INTERVAL 1 MONTH)';
  }

  const sequelizeCDR = app.get('sequelizeClientCDR');
  const sequelizeAst = app.get('sequelizeClient');

  //query outgoing calls for eligible extensions (with emails)
  let outgoingRes = await sequelizeCDR.query(
    "SELECT\n" +
    "    TIME_FORMAT(sc_start, '%h%p') AS hour,\n" +
    "    DATE_FORMAT(sc_start, '%a') AS day, \n" +
    "    DATE_FORMAT(sc_start, '%c-%e') AS date, \n" +
    "    Round(Sum(sc_duration / 60), 0) AS minutesOut,\n" +
    "    Round(AVG(sc_duration / 60), 0) AS avgDurationOut,\n" +
    "    sc_calleridnum AS cidNumOut,\n" +
    "    sc_calleridname AS cidNameOut,\n" +
    "    COUNT(sc_id) AS totalCalls\n" +
    "FROM\n" +
    "    sc_simplecdr \n" +
    "WHERE\n" +
    "    sc_te_id = "+ params.tenantId +"\n" +
    "    AND sc_calleridnum in("+ params.extNumArray.join(',') +")\n" +
    "    AND sc_direction = 'OUT'\n" +
    "    AND DATE(sc_start) "+ query_interval +" AND DATE(sc_start) < DATE(NOW())\n" +
    "GROUP BY\n" +
    "    HOUR(sc_start), cidNumOut;",
    { type: sequelizeCDR.QueryTypes.SELECT}
  ).then( res => res);
  //key outgoing results by the extension number
  let outgoing = groupBy(outgoingRes, 'cidNumOut');

  let queueIds = [];
  for(let i = 0; i<params.queues.length; i++){
    queueIds.push("'" + params.queues[i].id + "'");
  }

  const queueLogRes = await sequelizeAst.query(
    "SELECT \n" +
    "     TIME_FORMAT(time, '%h%p') AS hour,\n" +
    "     DATE_FORMAT(time, '%a') AS day, \n" +
    "     DATE_FORMAT(time, '%c-%e') AS date, \n" +
    "     time, \n" +
    "     agent, \n" +
    "     event, \n" +
    "     queuename, \n" +
    "     data1, \n" +
    "     data2, \n" +
    "     data3, \n" +
    "     data4 \n" +
    "FROM \n" +
    "     queue_log \n" +
    "WHERE \n" +
    "     queuename IN("+ queueIds.join(',') +") \n" +
    "     AND event IN('PAUSE', 'UNPAUSE', 'LOGIN', 'LOGOUT', 'COMPLETECALLER', 'COMPLETEAGENT', 'RINGNOANSWER', 'ABANDON', 'EXITWITHKEY', 'EXITWITHTIMEOUT', 'ATTENDEDTRANSFER', 'BLINDTRANSFER') \n" +
    "     AND DATE(time) "+ query_interval +" AND DATE(time) < DATE(NOW())\n" +
    "GROUP BY \n" +
    "     time, agent, event, queuename \n" +
    "ORDER BY \n" +
    "     time ASC \n;",
    { type: sequelizeAst.QueryTypes.SELECT}
  ).then( res => { return res; });

  //need to query record on simple cdr that are outside of queue
  const incomingRes = await sequelizeCDR.query(
    "SELECT \n" +
    "     TIME_FORMAT(start, '%h%p') AS hour,\n" +
    "     DATE_FORMAT(start, '%a') AS day, \n" +
    "     DATE_FORMAT(start, '%c-%e') AS date, \n" +
    "     duration AS data2, \n" +
    "     wherelanded AS extNumber \n" +
    "FROM \n" +
    "     cdr \n" +
    "WHERE \n" +
    "     accountcode = " + "'" + params.tenantCode + "'" +"\n" +
    "     AND lastapp NOT IN('Voicemail', 'Queue') \n " +
    "     AND duration > 0 \n" +
    "     AND userfield = '[inbound]' \n" +
    "     AND disposition = 'ANSWERED' \n" +
    "     AND wherelanded in("+ params.extNumArray.join(',') +")\n" +
    "     AND DATE(start) "+ query_interval +" AND DATE(start) < DATE(NOW())\n;",
    { type: sequelizeCDR.QueryTypes.SELECT }
  ).then( res => { return res; });
  //this groups these calls by the extension number so we can easily add them to the params.
  let incomingCDR = groupBy(incomingRes, 'extNumber');

  let incoming = {};
  let starts = {};
  let endings = {};
  let pauses = {};
  let missed = {};
  let queryData = groupBy(queueLogRes, 'agent');

  // console.log(queryData);

  if(queueLogRes.length){
    for(let agent in queryData){
      if(queryData.hasOwnProperty(agent)){
        let eventGroups = groupBy(queryData[agent], 'event');

        //session events for agent
        if(eventGroups.hasOwnProperty('LOGIN')){
          starts[params.extNameKey[agent]] = eventGroups['LOGIN'];
        }

        if(eventGroups.hasOwnProperty('LOGOUT')){
          endings[params.extNameKey[agent]] = eventGroups['LOGOUT'];
        }

        //completecaller events for incoming call data for agent
        let allIncoming = [];
        if(eventGroups.hasOwnProperty('COMPLETECALLER')){
          for(let i = 0; i<eventGroups['COMPLETECALLER'].length; i++){
            allIncoming.push(eventGroups['COMPLETECALLER'][i]);
          }
        }

        //completeagent events for incoming call data for agent
        if(eventGroups.hasOwnProperty('COMPLETEAGENT')){
          for(let i = 0; i<eventGroups['COMPLETEAGENT'].length; i++){
            allIncoming.push(eventGroups['COMPLETEAGENT'][i]);
          }
        }

        //attended transfer events that represent a completed queue call
        if(eventGroups.hasOwnProperty('ATTENDEDTRANSFER')){
          for(let i = 0; i < eventGroups['ATTENDEDTRANSFER'].length; i++){
            //just going to map the call time data to the same keys as above so later code will just work
            eventGroups['ATTENDEDTRANSFER'][i].data1 = +eventGroups['ATTENDEDTRANSFER'][i].data3;
            eventGroups['ATTENDEDTRANSFER'][i].data2 = +eventGroups['ATTENDEDTRANSFER'][i].data4;
            allIncoming.push(eventGroups['ATTENDEDTRANSFER'][i]);
          }
        }

        //blind transfer events that represent a completed queue call
        if(eventGroups.hasOwnProperty('BLINDTRANSFER')){
          for(let i = 0; i < eventGroups['BLINDTRANSFER'].length; i++){
            eventGroups['BLINDTRANSFER'][i].data1 = +eventGroups['BLINDTRANSFER'][i].data3;
            eventGroups['BLINDTRANSFER'][i].data2 = +eventGroups['BLINDTRANSFER'][i].data4;
            allIncoming.push(eventGroups['BLINDTRANSFER'][i]);
          }
        }

        //ring no answer events for agent
        if(eventGroups.hasOwnProperty('RINGNOANSWER')){
          missed[params.extNameKey[agent]] = eventGroups['RINGNOANSWER'];
        }

        //incoming events outside of queue for agent
        if(incomingCDR.hasOwnProperty(params.extNameKey[agent])){
          const incomingCDRGroup = incomingCDR[params.extNameKey[agent]];
          for(let i = 0; i < incomingCDRGroup.length; i++){
            allIncoming.push(incomingCDRGroup[i]);
          }
        }

        //assign the complete incoming object
        if(allIncoming.length){
          incoming[params.extNameKey[agent]] = allIncoming;
        }

        //pause events for agent
        let pauseEvents = [];
        for(let i = 0; i<queryData[agent].length; i++){
          if(queryData[agent][i].event === 'PAUSE' || queryData[agent][i].event === 'UNPAUSE'){
            pauseEvents.push(queryData[agent][i]);
          }
        }

        //loop through pause events to get actual pause detail
        //need to know if this is queue dependent to be sure groupings are consistent.
        let pauseMetrics = [];
        if(pauseEvents.length){
          const pauseByDay = groupBy(pauseEvents, 'date');
          for(let day in pauseByDay) {
            if (pauseByDay.hasOwnProperty(day)) {
              for (let i = 0; i < pauseByDay[day].length-1; i++) {
                const firstGroup = pauseByDay[day][i];
                const secondGroup = pauseByDay[day][i + 1];

                //if first group is an unpause just move on
                if (firstGroup.event === 'UNPAUSE') {continue;}

                //if we are on a pause event
                const pauseReason = firstGroup.data1;
                const pauseTime = firstGroup.time;
                const unpauseTime = secondGroup.time;
                const pauseLength = moment.utc(unpauseTime, 'YYYY-MM-DDTHH:mm:ssZ').diff(moment.utc(pauseTime, 'YYYY-MM-DDTHH:mm:ssZ'), 'seconds');
                pauseMetrics.push({
                  reason: pauseReason,
                  length: pauseLength
                });
              }

              //need to check if the final pause event for the day was a pause
              //we can assume the next end session for the queue number is the unpause event as well.
              if (pauseByDay[day][pauseByDay[day].length - 1].event === 'PAUSE') {
                const finalPauseEvent = pauseByDay[day][pauseByDay[day].length - 1];
                const finalPauseQueue = finalPauseEvent.queuename;
                //we have the final pause event and the queue it was recorded for
                //loop through end sessions in reverse and use the first end session event that matches the queue to calculate the pause

                if(endings.hasOwnProperty(params.extNameKey[agent])){
                  const endingsByDay = groupBy(endings[params.extNameKey[agent]], 'date');
                  if(endingsByDay.hasOwnProperty(day)){
                    const endingsReversed = endingsByDay[day].reverse();
                    let eventFound = 0;
                    for(let i = 0; i<endingsReversed.length; i++){
                      if(endingsReversed[i].queuename === finalPauseQueue){
                        const pauseReason = finalPauseEvent.data1;
                        const pauseTime = finalPauseEvent.time;
                        const unpauseTime = endingsReversed[i].time;
                        const pauseLength = moment.utc(unpauseTime, 'YYYY-MM-DDTHH:mm:ssZ').diff(moment.utc(pauseTime, 'YYYY-MM-DDTHH:mm:ssZ'), 'seconds');
                        pauseMetrics.push({
                          reason: pauseReason,
                          length: pauseLength
                        });
                        eventFound = 1;
                      }
                      if(eventFound){
                        break;
                      }
                    }
                  }
                }
              }
            }
          }
          pauses[params.extNameKey[agent]] = pauseMetrics;
        }
      }
    }
  }

  //initialize hourly call volume stats for all queues
  let stats = {
    '12AM': {
      timeRange: '12AM - 01AM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '01AM': {
      timeRange: '01AM - 02AM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '02AM': {
      timeRange: '02AM - 03AM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '03AM': {
      timeRange: '03AM - 04AM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '04AM': {
      timeRange: '04AM - 05AM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '05AM': {
      timeRange: '05AM - 06AM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '06AM': {
      timeRange: '06AM - 07AM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '07AM': {
      timeRange: '07AM - 08AM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '08AM': {
      timeRange: '08AM - 09AM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '09AM': {
      timeRange: '09AM - 10AM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '10AM': {
      timeRange: '10AM - 11AM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '11AM': {
      timeRange: '11AM - 12PM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '12PM': {
      timeRange: '12PM - 01PM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '01PM': {
      timeRange: '01PM - 02PM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '02PM': {
      timeRange: '02PM - 03PM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '03PM': {
      timeRange: '03PM - 04PM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '04PM': {
      timeRange: '04PM - 05PM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '05PM': {
      timeRange: '05PM - 06PM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '06PM': {
      timeRange: '06PM - 07PM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '07PM': {
      timeRange: '07PM - 08PM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '08PM': {
      timeRange: '08PM - 09PM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '09PM': {
      timeRange: '09PM - 10PM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '10PM': {
      timeRange: '10PM - 11PM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    },
    '11PM': {
      timeRange: '11PM - 12AM',
      totalCalls: 0,
      outBoundCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      missedCalls: 0
    }
  };

  let queueStats = {};
  let queueAgentDetails = {};
  //initialize the queue details by queue object
  if(interval === 'MONTHLY'){
    for(let i = 0; i<params.queues.length; i++){
      queueStats[params.queues[i].id] = {
        totalIncoming: 0,
        totalMissed: 0,
        totalWaitTime: 0,
        totalTalkTime: 0,
        totalAbandoned: 0,
        longestWait: 0,
        waitOverTwo: 0,
        completedSLA: 0,
        totalTimeSLA: 0,
        lastWeekOverTwo: 0,
        lastWeekTotalIncoming: 0,
        lastMonthOverTwo: 0,
        queueName: params.queues[i].name,
        exitsByKey: {},
        exitsByTimeout: 0,
        statsDaily: {
          '1': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '2': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '3': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '4': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '5': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '6': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '7': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '8': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '9': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '10': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '11': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '12': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '13': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '14': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '15': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '16': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '17': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '18': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '19': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '20': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '21': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '22': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '23': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '24': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '25': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '26': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '27': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '28': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '29': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '30': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          },
          '31': {
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalWaitTime: 0
          }
        }
      }
    }
  } else if (interval === 'WEEKLY'){
    for(let i = 0; i<params.queues.length; i++){
      queueStats[params.queues[i].id] = {
        totalIncoming: 0,
        totalMissed: 0,
        totalWaitTime: 0,
        totalTalkTime: 0,
        totalAbandoned: 0,
        longestWait: 0,
        waitOverTwo: 0,
        completedSLA: 0,
        totalTimeSLA: 0,
        lastWeekOverTwo: 0,
        lastWeekTotalIncoming: 0,
        lastMonthOverTwo: 0,
        queueName: params.queues[i].name,
        exitsByKey: {},
        exitsByTimeout: 0,
        statsDaily: {
          'Sun': {
            dayLetter: 'S',
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalMissed: 0
          },
          'Mon': {
            dayLetter: 'M',
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalMissed: 0
          },
          'Tue': {
            dayLetter: 'T',
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalMissed: 0
          },
          'Wed': {
            dayLetter: 'W',
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalMissed: 0
          },
          'Thu': {
            dayLetter: 'T',
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalMissed: 0
          },
          'Fri': {
            dayLetter: 'F',
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalMissed: 0
          },
          'Sat': {
            dayLetter: 'S',
            totalCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            totalMissed: 0
          }
        }
      }
    }
  } else{
    for(let i = 0; i<params.queues.length; i++){
      queueStats[params.queues[i].id] = {
        totalIncoming: 0,
        totalMissed: 0,
        totalWaitTime: 0,
        totalTalkTime: 0,
        totalAbandoned: 0,
        longestWait: 0,
        waitOverTwo: 0,
        completedSLA: 0,
        totalTimeSLA: 0,
        lastWeekOverTwo: 0,
        lastWeekTotalIncoming: 0,
        lastMonthOverTwo: 0,
        queueName: params.queues[i].name,
        exitsByKey: {},
        exitsByTimeout: 0,
        statsDaily: {
          '12AM': {
            timeRange: '12AM - 01AM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '01AM': {
            timeRange: '01AM - 02AM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '02AM': {
            timeRange: '02AM - 03AM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '03AM': {
            timeRange: '03AM - 04AM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '04AM': {
            timeRange: '04AM - 05AM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '05AM': {
            timeRange: '05AM - 06AM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '06AM': {
            timeRange: '06AM - 07AM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '07AM': {
            timeRange: '07AM - 08AM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '08AM': {
            timeRange: '08AM - 09AM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '09AM': {
            timeRange: '09AM - 10AM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '10AM': {
            timeRange: '10AM - 11AM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '11AM': {
            timeRange: '11AM - 12PM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '12PM': {
            timeRange: '12PM - 01PM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '01PM': {
            timeRange: '01PM - 02PM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '02PM': {
            timeRange: '02PM - 03PM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '03PM': {
            timeRange: '03PM - 04PM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '04PM': {
            timeRange: '04PM - 05PM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '05PM': {
            timeRange: '05PM - 06PM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '06PM': {
            timeRange: '06PM - 07PM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '07PM': {
            timeRange: '07PM - 08PM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '08PM': {
            timeRange: '08PM - 09PM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '09PM': {
            timeRange: '09PM - 10PM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '10PM': {
            timeRange: '10PM - 11PM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          },
          '11PM': {
            timeRange: '11PM - 12AM',
            totalCalls: 0,
            outBoundCalls: 0,
            answeredCalls: 0,
            abandonedCalls: 0,
            missedCalls: 0
          }
        }
      }
    }
  }


  //we need to go ahead and initialize all the agent details objects so no one is left out.
  //console.log(queryData);
  for(let agent in queryData){
    if(queryData.hasOwnProperty(agent)){
      const queueGroups = groupBy(queryData[agent], 'queuename');
      const queueIds = Object.keys(queueGroups);
      for(let i = 0; i < queueIds.length; i++){
        if(!queueAgentDetails.hasOwnProperty(queueIds[i])){
          queueAgentDetails[queueIds[i]] = {}
        }
        const agentExt = params.extNameKey[agent];
        if(agentExt){
          queueAgentDetails[queueIds[i]][agentExt] = {
            totalInbound: 0,
            talkTime: 0,
            refused: 0
          }
        }
      }
    }
  }

  //console.log(queueAgentDetails);


  //now that all agent stuff is built, build the queue details
  let totalAllIncoming = 0;
  let totalAllOutbound = 0;
  let totalTalkTime = 0;
  //incremental for agent calls outside of queue
  let totalAgentCalls = 0;
  let totalMissed = 0;
  for(let i = 0; i<params.extNumArray.length; i++){
    const currentExt = params.extNumArray[i];

    //adds up incoming calls and duration. (FOR CALLS OUTSIDE OF QUEUE THERE WILL NOT BE A QUEUE NAME)
    if(incoming.hasOwnProperty(currentExt)){
      for(let k = 0; k<incoming[currentExt].length; k++){

        const currentGroup = incoming[currentExt][k];
        const waitTime = parseInt(currentGroup['data1']);
        const callDuration = parseInt(currentGroup['data2']);

        const callerTime = waitTime + callDuration;
        const completeTime = currentGroup.time;
        const inboundHour = moment.utc(completeTime).subtract(callerTime, 'seconds').format('hhA');

        //initializes the Queue on Queue Agent Incoming
        if(!queueAgentDetails.hasOwnProperty(currentGroup['queuename'])){
          queueAgentDetails[currentGroup['queuename']] = {};
        }

        //queue details (SKIP THIS IF THE INCOMING CALL IS OUTSIDE OF QUEUE)
        if (currentGroup.hasOwnProperty('queuename')){

          //initializes the extension data on queueAgentIncoming
          /*if(!queueAgentDetails[currentGroup['queuename']].hasOwnProperty(currentExt)){
            queueAgentDetails[currentGroup['queuename']][currentExt] = {
              totalInbound: 0,
              talkTime: 0,
              refused: 0
            };
          }*/

          queueStats[currentGroup['queuename']]['totalIncoming']++;
          queueStats[currentGroup['queuename']]['totalWaitTime'] += waitTime;
          queueStats[currentGroup['queuename']]['totalTalkTime'] += callDuration;

          //queueInbound Metrics
          queueAgentDetails[currentGroup['queuename']][currentExt].totalInbound++;
          queueAgentDetails[currentGroup['queuename']][currentExt].talkTime += callDuration;

          //completed SLA
          if(waitTime <= 30){
            queueStats[currentGroup['queuename']]['completedSLA']++;
            queueStats[currentGroup['queuename']]['totalTimeSLA']+= waitTime;
          }
          //wait over 2 minutes
          if(waitTime > 120){
            queueStats[currentGroup['queuename']]['waitOverTwo']++;
          }
          if(waitTime > queueStats[currentGroup['queuename']]['longestWait']){
            queueStats[currentGroup['queuename']]['longestWait'] = waitTime;
          }
          //the format is a little different for monthly (we go by the actual date instead of day name)
          if(interval === 'MONTHLY'){
            queueStats[currentGroup['queuename']]['statsDaily'][currentGroup['date'].split('-')[1]]['totalCalls']++;
            queueStats[currentGroup['queuename']]['statsDaily'][currentGroup['date'].split('-')[1]]['answeredCalls']++;
            queueStats[currentGroup['queuename']]['statsDaily'][currentGroup['date'].split('-')[1]]['totalWaitTime'] += waitTime;
          } else if (interval === 'WEEKLY'){
            queueStats[currentGroup['queuename']]['statsDaily'][currentGroup['day']]['totalCalls']++;
            queueStats[currentGroup['queuename']]['statsDaily'][currentGroup['day']]['answeredCalls']++;
          } else{
            queueStats[currentGroup['queuename']]['statsDaily'][inboundHour]['totalCalls']++;
            queueStats[currentGroup['queuename']]['statsDaily'][inboundHour]['answeredCalls']++;
          }

          //increment queue incoming total and hourly total for distribution (queue only)
          //we are using completed events so lets total up talk time and hold time to make sure the incoming hour is accurate
          stats[inboundHour]['answeredCalls']++;
          stats[inboundHour]['totalCalls']++;
          totalAllIncoming++;
        }else{
          //must be incoming outside of queue
          totalAgentCalls++;
        }

        //update totals for all incoming calls (queue and agent)
        totalTalkTime += callDuration;
      }
    }

    //adds up outbound calls and duration
    if(outgoing.hasOwnProperty(currentExt)){
      for(let k = 0; k<outgoing[currentExt].length; k++){
        totalAllOutbound += outgoing[currentExt][k]['totalCalls'];
        totalTalkTime += outgoing[currentExt][k]['minutesOut'] * 60;
        stats[outgoing[currentExt][k]['hour']]['outBoundCalls']+= outgoing[currentExt][k]['totalCalls'];
        stats[outgoing[currentExt][k]['hour']]['totalCalls']+= outgoing[currentExt][k]['totalCalls'];
      }
    }

    //missed call info
    if(missed.hasOwnProperty(currentExt)){
      for(let k = 0; k<missed[currentExt].length; k++){
        const currentEvent = missed[currentExt][k];

        //initializes the Queue on Queue Agent Incoming
        if(!queueAgentDetails.hasOwnProperty(currentEvent['queuename'])){
          queueAgentDetails[currentEvent['queuename']] = {};
        }
        //initializes the extension data on queueAgentIncoming
        if(!queueAgentDetails[currentEvent['queuename']].hasOwnProperty(currentExt)){
          queueAgentDetails[currentEvent['queuename']][currentExt] = {
            totalInbound: 0,
            talkTime: 0,
            refused: 0
          };
        }
        queueAgentDetails[currentEvent['queuename']][currentExt].refused++;
      }
    }

  }

  //loops through abandon events in queue to increment abandoned calls
  let totalAbandoned = 0;
  if(queueLogRes.length){
    const onlyQueueEvents = groupBy(queryData['NONE'], 'event');
    if(onlyQueueEvents.hasOwnProperty('ABANDON')){
      for(let k = 0; k<onlyQueueEvents['ABANDON'].length; k++){
        const currentEvent = onlyQueueEvents['ABANDON'][k];
        queueStats[currentEvent['queuename']]['totalAbandoned']++;

        //the format is a little different for monthly (we go by the actual date instead of day name)
        if(interval === 'MONTHLY'){
          queueStats[currentEvent['queuename']]['statsDaily'][currentEvent['date'].split('-')[1]]['totalCalls']++;
          queueStats[currentEvent['queuename']]['statsDaily'][currentEvent['date'].split('-')[1]]['abandonedCalls']++;
        } else if(interval === 'WEEKLY'){
          queueStats[currentEvent['queuename']]['statsDaily'][currentEvent['day']]['totalCalls']++;
          queueStats[currentEvent['queuename']]['statsDaily'][currentEvent['day']]['abandonedCalls']++;
        }

        totalAbandoned++;
        stats[currentEvent['hour']]['abandonedCalls']++;
        stats[currentEvent['hour']]['totalCalls']++;
      }
    }

    //EXIT WITH KEY EVENTS
    if(onlyQueueEvents.hasOwnProperty('EXITWITHKEY')){
      for(let k = 0; k<onlyQueueEvents['EXITWITHKEY'].length; k++){
        const currentEvent = onlyQueueEvents['EXITWITHKEY'][k];
        const keyPress = currentEvent['data1'];
        const queuename = currentEvent['queuename'];

        if(queueStats[queuename]['exitsByKey'].hasOwnProperty(keyPress)){
          queueStats[queuename]['exitsByKey'][keyPress]++;
        } else{
          queueStats[queuename]['exitsByKey'][keyPress] = 1;
        }

      }
    }

    //EXIT WITH TIMEOUT EVENTS
    if(onlyQueueEvents.hasOwnProperty('EXITWITHTIMEOUT')){
      for(let k = 0; k<onlyQueueEvents['EXITWITHTIMEOUT'].length; k++){
        const currentEvent = onlyQueueEvents['EXITWITHTIMEOUT'][k];
        queueStats[currentEvent['queuename']]['exitsByTimeout']++;
      }
    }

  }

  // console.log(queueAgentDetails['298']);
  // console.log(queueAgentMissed['298']);
  // console.log(missed);

  const queueData = {
    hourlyStats: stats,
    queueStats,
    queueAgentDetails,
    totals: {
      outboundCalls: totalAllOutbound,
      answeredCalls: totalAllIncoming,
      totalMissed,
      missedCalls: totalMissed,
      agentCalls: totalAgentCalls,
      totalAbandoned,
      talkTime: totalTalkTime
    }
  };

  //each key will return undefined if no result for particular key
  return {
    incoming,
    outgoing,
    missed,
    pauses,
    endings,
    starts,
    queueData
  }

};
