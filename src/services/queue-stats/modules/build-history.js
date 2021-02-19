const groupBy = require('lodash/groupBy');
const sortBy = require('lodash/sortBy');
const moment = require('moment');

module.exports = async (ids, app, start, end) => {

  //sequelize client for raw queries.
  const sequelize = app.get('sequelizeClient');

  //initialize tenant ids. the maps are just key => value maps to relate queue to tenant id and vice versa.
  let tenantIds = [];
  let queueTenantMap = {};
  let tenantQueueMap = {};

  //query queue logs
  const logs = await app.service('queue-log').find({
    paginate: false,
    query: {
      queueId: {$in: ids},
      time: {$gte: start, $lte: end},
      event: {$in: ['COMPLETECALLER', 'COMPLETEAGENT', 'ABANDON', 'PAUSE', 'UNPAUSE', 'RINGNOANSWER', 'REMOVEMEMBER', 'EXITWITHKEY', 'EXITWITHTIMEOUT', 'ATTENDEDTRANSFER', 'BLINDTRANSFER']}
    }
  });

  //get all the tenantIds based on the queueIds since queue log does not contain tenant id.
  const queues = await app.service('queues').find({
    paginate: false,
    query: {
      id: {$in: ids},
      $select: ['tenantId', 'id']
    }
  });

  //build tenant ids and key => value maps.
  const queueLength = queues.length;
  for(let i = 0; i<queueLength; i++){
    tenantIds.push(queues[i].tenantId);
    queueTenantMap[queues[i].id] = queues[i].tenantId;
    tenantQueueMap[queues[i].tenantId] = queues[i].id;
  }

  //query all the agents for all the queues okay.
  const membersRes = await sequelize.query(
    'SELECT ' +
    'X.uniqueid, ' +
    'X.membername, ' +
    'X.queue_name, ' +
    'X.interface as member_interface, ' +
    'X.member_device, ' +
    'X.paused, ' +
    'X.logged_in AS loggedIn, ' +
    'X.qu_te_id AS tenantId, ' +
    'st_states.st_state AS extStatus, ' +
    'ex_extensions.ex_id AS extensionId, ' +
    'ex_extensions.ex_dnd AS dnd, ' +
    'us_users.us_avatar_path AS avatar ' +
    'FROM (' +
    'SELECT ' +
    'queue_member.*, ' +
    'qu_queues.qu_te_id ' +
    'FROM ' +
    'queue_member ' +
    'INNER JOIN qu_queues ON queue_member.queue_name = qu_queues.qu_id ' +
    'WHERE ' +
    'queue_member.queue_name IN ('+ids+') ' +
    'UNION ' +
    'SELECT ' +
    'aq_allowed_queue_member.*, ' +
    'qu_queues.qu_te_id ' +
    'FROM ' +
    'aq_allowed_queue_member ' +
    'INNER JOIN qu_queues ON aq_allowed_queue_member.aq_queue_name = qu_queues.qu_id ' +
    'WHERE aq_allowed_queue_member.aq_queue_name IN ('+ids+')) AS X, ' +
    'st_states, ' +
    'ex_extensions ' +
    'LEFT JOIN us_users ON ex_extensions.ex_email = us_users.us_username ' +
    'WHERE ' +
    'st_states.st_extension = X.member_device AND ' +
    'ex_extensions.ex_number = SUBSTRING_INDEX(X.member_device, \'-\', 1) AND ' +
    'ex_extensions.ex_te_id = X.qu_te_id ' +
    'GROUP BY ' +
    'membername, queue_name;',
    { type: sequelize.QueryTypes.SELECT}
  );

  //cumulative array of all agents we need to report on.
  let agentsArray = [...membersRes];

  //build array of extensions across entire query
  let extensions = [];
  const agentsLength = agentsArray.length;
  for(let i = 0; i < agentsLength; i++){
    const deviceSplit = agentsArray[i].member_device.split('-');
    agentsArray[i].extension = deviceSplit[0];
    extensions.push(+deviceSplit[0]);
    agentsArray[i].connected = '-';
    agentsArray[i].direction = '-';
  }

  //query outbound calls for all agents using extensions array from above and all tenantIds array from above
  const outboundData = await app.service('call-history').find({
    paginate: false,
    query: {
      tenantId: {$in: tenantIds},
      callerIdNumber: {$in: extensions},
      direction: 'OUT',
      start: {$gte: start, $lte:end}
    }
  });

  //order outbound calls by tenant Id
  const callsGroup = groupBy(outboundData, 'tenantId');

  //group the queue_log events by queuename
  const queueGroups = groupBy(logs, 'queueId');
  const agentGroups = groupBy(agentsArray, 'queue_name');

  //build the summary data per queue.
  const summaryData = {};
  for(let i = 0; i < queues.length; i++){
    const queue = queues[i].id.toString();
    if(agentGroups.hasOwnProperty(queue)){

      //group all the events for this queue by the event type.
      const eventGroups = groupBy(queueGroups[queue], 'event');

      //initialize queue vars, considering a ham sandwich.
      let totalCalls = 0;
      let outboundCalls = 0;
      let inboundCalls = 0;
      let inboundComplete = 0;
      let outboundComplete = 0;
      let inboundTalkTime = 0;
      let outboundTalkTime = 0;
      let completedCalls = 0;
      let waitTime = 0;
      let callDuration = 0;
      let abandonedCalls = 0;
      let slaTime = 30;
      let totalSLA = 0;
      let shortestWait = null;
      let longestWait = null;
      const agentGroupsLength = agentGroups[queue].length;

      //initialize the data for the plotses
      let dailyMetrics = {};

      //initialize the agent data
      for(let i = 0; i < agentGroupsLength; i++){
        agentGroups[queue][i].inboundTotal = 0;
        agentGroups[queue][i].inboundTalkTime = 0;
        agentGroups[queue][i].outboundTotal = 0;
        agentGroups[queue][i].outboundTalkTime = 0;
        agentGroups[queue][i].pauseTime = 0;
      }

      //let us look at all the complete caller events and sum on those.
      if(eventGroups.hasOwnProperty('COMPLETECALLER')){

        //let's loop over the COMPLETE CALLER EVENTS BY AGENT
        //we will update cumulative queue stats and stats per agent here.
        const extCompleteCallerGroups = groupBy(eventGroups.COMPLETECALLER, 'agent');
        for(let i = 0; i < agentGroupsLength; i++){
          if(extCompleteCallerGroups.hasOwnProperty(agentGroups[queue][i].membername)){
            const callListLength = extCompleteCallerGroups[agentGroups[queue][i].membername].length;
            agentGroups[queue][i].inboundTotal += callListLength;
            inboundCalls += callListLength;
            inboundComplete += callListLength;
            completedCalls += callListLength;
            totalCalls += callListLength;

            for(let k = 0; k < callListLength; k++){
              const currentCall = extCompleteCallerGroups[agentGroups[queue][i].membername][k];
              const holdTime = +currentCall.data1;
              const callTime = +currentCall.data2;
              agentGroups[queue][i].inboundTalkTime += callTime;
              callDuration += callTime;
              waitTime += holdTime;
              inboundTalkTime += callTime;

              //figure out the shortest and longest waits of this call list group
              if(!shortestWait){
                shortestWait = holdTime;
              } else{
                const newShortest = holdTime < shortestWait;
                if(newShortest) shortestWait = holdTime;
              }

              if(!longestWait){
                longestWait = holdTime;
              } else{
                const newLongest = holdTime > shortestWait;
                if(newLongest) longestWait = holdTime;
              }

              //increment SLA calls if worthy
              if(holdTime <= slaTime){
                totalSLA++;
              }

              //figure out the day time stamp and increment appropriate metric
              //have to figure out time the call actually arrived using duration and hold time.
              const callHour = currentCall.time;
              const inboundHour = moment.utc(callHour).subtract(callTime, 'seconds').format('YYYY-MM-DD');
              if(dailyMetrics.hasOwnProperty(inboundHour)){
                dailyMetrics[inboundHour].inboundVolume++;
                dailyMetrics[inboundHour].inboundDuration += callTime;
              } else {
                dailyMetrics[inboundHour] = {
                  inboundVolume: 1,
                  outboundVolume: 0,
                  inboundDuration: callTime,
                  outboundDuration: 0,
                  abandonedVolume: 0,
                  exitTimeout: 0,
                  exitKey: 0
                };
              }
            }
          }
        }
      }

      //let us look at all the complete agent events and sum on those.
      if(eventGroups.hasOwnProperty('COMPLETEAGENT')){
        const extCompleteAgentGroups = groupBy(eventGroups.COMPLETEAGENT, 'agent');

        for(let i = 0; i < agentGroupsLength; i++){

          if(extCompleteAgentGroups.hasOwnProperty(agentGroups[queue][i].membername)){
            const callListLength = extCompleteAgentGroups[agentGroups[queue][i].membername].length;
            agentGroups[queue][i].inboundTotal += callListLength;
            inboundCalls += callListLength;
            inboundComplete += callListLength;
            completedCalls += callListLength;
            totalCalls += callListLength;

            for(let k = 0; k < callListLength; k++){
              const currentCall = extCompleteAgentGroups[agentGroups[queue][i].membername][k];
              const holdTime = +currentCall.data1;
              const callTime = +currentCall.data2;
              agentGroups[queue][i].inboundTalkTime += callTime;
              callDuration += callTime;
              waitTime += holdTime;
              inboundTalkTime += callTime;

              if(!shortestWait){
                shortestWait = holdTime;
              } else{
                const newShortest = holdTime < shortestWait;
                if(newShortest) shortestWait = holdTime;
              }

              if(!longestWait){
                longestWait = holdTime;
              } else{
                const newLongest = holdTime > shortestWait;
                if(newLongest) longestWait = holdTime;
              }

              if(holdTime <= slaTime){
                totalSLA++;
              }

              //figure out the hour time stamp and increment appropriate metric
              const callHour = currentCall.time;
              const inboundHour = moment.utc(callHour).subtract(callTime, 'seconds').format('YYYY-MM-DD');
              if(dailyMetrics.hasOwnProperty(inboundHour)){
                dailyMetrics[inboundHour].inboundVolume++;
                dailyMetrics[inboundHour].inboundDuration += callTime;
              } else{
                dailyMetrics[inboundHour] = {
                  inboundVolume: 1,
                  outboundVolume: 0,
                  inboundDuration: callTime,
                  outboundDuration: 0,
                  abandonedVolume: 0,
                  exitTimeout: 0,
                  exitKey: 0
                };
              }

            }
          }
        }
      }

      if(eventGroups.hasOwnProperty('ATTENDEDTRANSFER')){
        const extCompleteAgentGroups = groupBy(eventGroups.ATTENDEDTRANSFER, 'agent');

        for(let i = 0; i < agentGroupsLength; i++){

          if(extCompleteAgentGroups.hasOwnProperty(agentGroups[queue][i].membername)){
            const callListLength = extCompleteAgentGroups[agentGroups[queue][i].membername].length;
            agentGroups[queue][i].inboundTotal += callListLength;
            inboundCalls += callListLength;
            inboundComplete += callListLength;
            completedCalls += callListLength;
            totalCalls += callListLength;

            for(let k = 0; k < callListLength; k++){
              const currentCall = extCompleteAgentGroups[agentGroups[queue][i].membername][k];
              const holdTime = +currentCall.data3;
              const callTime = +currentCall.data4;
              agentGroups[queue][i].inboundTalkTime += callTime;
              callDuration += callTime;
              waitTime += holdTime;
              inboundTalkTime += callTime;

              if(!shortestWait){
                shortestWait = holdTime;
              } else{
                const newShortest = holdTime < shortestWait;
                if(newShortest) shortestWait = holdTime;
              }

              if(!longestWait){
                longestWait = holdTime;
              } else{
                const newLongest = holdTime > shortestWait;
                if(newLongest) longestWait = holdTime;
              }

              if(holdTime <= slaTime){
                totalSLA++;
              }

              //figure out the hour time stamp and increment appropriate metric
              const callHour = currentCall.time;
              const inboundHour = moment.utc(callHour).subtract(callTime, 'seconds').format('YYYY-MM-DD');
              if(dailyMetrics.hasOwnProperty(inboundHour)){
                dailyMetrics[inboundHour].inboundVolume++;
                dailyMetrics[inboundHour].inboundDuration += callTime;
              } else{
                dailyMetrics[inboundHour] = {
                  inboundVolume: 1,
                  outboundVolume: 0,
                  inboundDuration: callTime,
                  outboundDuration: 0,
                  abandonedVolume: 0,
                  exitTimeout: 0,
                  exitKey: 0
                };
              }

            }
          }
        }
      }

      if(eventGroups.hasOwnProperty('BLINDTRANSFER')){
        const extCompleteAgentGroups = groupBy(eventGroups.BLINDTRANSFER, 'agent');

        for(let i = 0; i < agentGroupsLength; i++){

          if(extCompleteAgentGroups.hasOwnProperty(agentGroups[queue][i].membername)){
            const callListLength = extCompleteAgentGroups[agentGroups[queue][i].membername].length;
            agentGroups[queue][i].inboundTotal += callListLength;
            inboundCalls += callListLength;
            inboundComplete += callListLength;
            completedCalls += callListLength;
            totalCalls += callListLength;

            for(let k = 0; k < callListLength; k++){
              const currentCall = extCompleteAgentGroups[agentGroups[queue][i].membername][k];
              const holdTime = +currentCall.data3;
              const callTime = +currentCall.data4;
              agentGroups[queue][i].inboundTalkTime += callTime;
              callDuration += callTime;
              waitTime += holdTime;
              inboundTalkTime += callTime;

              if(!shortestWait){
                shortestWait = holdTime;
              } else{
                const newShortest = holdTime < shortestWait;
                if(newShortest) shortestWait = holdTime;
              }

              if(!longestWait){
                longestWait = holdTime;
              } else{
                const newLongest = holdTime > shortestWait;
                if(newLongest) longestWait = holdTime;
              }

              if(holdTime <= slaTime){
                totalSLA++;
              }

              //figure out the hour time stamp and increment appropriate metric
              const callHour = currentCall.time;
              const inboundHour = moment.utc(callHour).subtract(callTime, 'seconds').format('YYYY-MM-DD');
              if(dailyMetrics.hasOwnProperty(inboundHour)){
                dailyMetrics[inboundHour].inboundVolume++;
                dailyMetrics[inboundHour].inboundDuration += callTime;
              } else{
                dailyMetrics[inboundHour] = {
                  inboundVolume: 1,
                  outboundVolume: 0,
                  inboundDuration: callTime,
                  outboundDuration: 0,
                  abandonedVolume: 0,
                  exitTimeout: 0,
                  exitKey: 0
                };
              }

            }
          }
        }
      }

      //let us look at agent unanswered calls and sum on those. this does not necessarily mean the call was never answered in the queue.
      if(eventGroups.hasOwnProperty('RINGNOANSWER')){
        const extNoAnswerGroups = groupBy(eventGroups.RINGNOANSWER, 'agent');
        for(let i = 0; i < agentGroupsLength; i++){
          agentGroups[queue][i].refusedCalls = 0;
          if(extNoAnswerGroups.hasOwnProperty(agentGroups[queue][i].membername)){
            agentGroups[queue][i].refusedCalls += extNoAnswerGroups[agentGroups[queue][i].membername].length;
          }
        }
      }

      //let us look at abandoned calls and sum on those
      if(eventGroups.hasOwnProperty('ABANDON')){
        const totalAbandon = eventGroups.ABANDON.length;
        abandonedCalls += totalAbandon;
        totalCalls += totalAbandon;

        //update hour metrics for each abandon event.
        for(let i = 0; i < totalAbandon; i++){
          const callHour = eventGroups.ABANDON[i].time;
          const callerTime = +eventGroups.ABANDON[i].data3;
          const inboundHour = moment.utc(callHour).subtract(callerTime, 'seconds').format('YYYY-MM-DD');
          if(dailyMetrics.hasOwnProperty(inboundHour)){
            dailyMetrics[inboundHour].abandonedVolume++;
          } else{
            dailyMetrics[inboundHour] = {
              inboundVolume: 0,
              outboundVolume: 0,
              inboundDuration: 0,
              outboundDuration: 0,
              abandonedVolume: 1,
              exitTimeout: 0,
              exitKey: 0
            };
          }
        }
      }

      //exit by key press events
      if(eventGroups.hasOwnProperty('EXITWITHKEY')){
        const totalExitKey = eventGroups.EXITWITHKEY.length;
        totalCalls += totalExitKey;
        //update hourly metrics
        for(let i = 0; i < totalExitKey; i++){
          const callHour = moment.utc(eventGroups.EXITWITHKEY[i].time).format('YYYY-MM-DD');
          if(dailyMetrics.hasOwnProperty(callHour)){
            dailyMetrics[callHour].exitKey++;
          }else{
            dailyMetrics[callHour] = {
              inboundVolume: 0,
              outboundVolume: 0,
              inboundDuration: 0,
              outboundDuration: 0,
              abandonedVolume: 0,
              exitTimeout: 0,
              exitKey: 1
            };
          }
        }
      }

      //exit by timeout events
      if(eventGroups.hasOwnProperty('EXITWITHTIMEOUT')){
        const totalExitTimeout = eventGroups.EXITWITHTIMEOUT.length;
        totalCalls += totalExitTimeout;
        //update hourly metrics
        for(let i = 0; i < totalExitTimeout; i++){
          const callHour = moment.utc(eventGroups.EXITWITHTIMEOUT[i].time).format('YYYY-MM-DD');
          if(dailyMetrics.hasOwnProperty(callHour)){
            dailyMetrics[callHour].exitTimeout++;
          } else{
            dailyMetrics[callHour] = {
              inboundVolume: 0,
              outboundVolume: 0,
              inboundDuration: 0,
              outboundDuration: 0,
              abandonedVolume: 0,
              exitTimeout: 1,
              exitKey: 0
            };
          }

        }
      }

      //calculate the abandon rate and the service level based on total calls incoming to queue.
      const abandonRate = parseFloat((abandonedCalls / totalCalls).toFixed(2));
      const serviceLevel = parseFloat((totalSLA / totalCalls).toFixed(2));


      //HERE STARTS HANDLING OF THE OUTBOUND CALL DATA (NOT RELATED TO QUEUE LOG EVENTS)

      //first group all the outbound calls for this queue by the extension.
      const extOutboundCallGroups = groupBy(callsGroup[queueTenantMap[queue]], 'callerIdNumber');

      //loop over the agents, and compute the total number of outbound per agent off the variable above.
      //we can also compute the total outbound call metric while we are.
      //Now that we have all the users let's go ahead and look at pause data for each agent and knock that out.
      const agentEventGroups = groupBy(queueGroups[queue], 'agent');
      for(let i = 0; i<agentGroupsLength; i++){
        //outbound stuff
        if(extOutboundCallGroups.hasOwnProperty(agentGroups[queue][i].extension)){

          //loop over outbound calls for extensions and add up the metrics for the agent.
          const callListLength = extOutboundCallGroups[agentGroups[queue][i].extension].length;
          agentGroups[queue][i].outboundTotal = callListLength;
          outboundCalls += callListLength;
          totalCalls += callListLength;

          //if the outbound call was answered let us bump up the agents total outbound talk time.
          for(let k = 0; k < callListLength; k++){
            const currentCall = extOutboundCallGroups[agentGroups[queue][i].extension][k];
            if(currentCall.disposition === 'ANSWERED'){
              agentGroups[queue][i].outboundTalkTime += +currentCall.duration;
              outboundTalkTime += +currentCall.duration;
              callDuration += +currentCall.duration;
              outboundComplete++;
              completedCalls++;

              //hourly metric update
              const callHour = moment.utc(currentCall.start).format('YYYY-MM-DD');
              if(dailyMetrics.hasOwnProperty(callHour)){
                dailyMetrics[callHour].outboundVolume++;
                dailyMetrics[callHour].outboundDuration += +currentCall.duration;
              } else{
                dailyMetrics[callHour] = {
                  inboundVolume: 0,
                  outboundVolume: 1,
                  inboundDuration: 0,
                  outboundDuration: +currentCall.duration,
                  abandonedVolume: 0,
                  exitTimeout: 0,
                  exitKey: 0
                };
              }

            }
          }
        }

        //pause stuff for all agents listed on this queue.
        if(agentEventGroups.hasOwnProperty(agentGroups[queue][i].membername)){

          const agentEventGroupLength = agentEventGroups[agentGroups[queue][i].membername].length;
          let pauseEvents = [];
          let endings = [];
          for(let k = 0; k<agentEventGroupLength; k++){
            const currentEvent = agentEventGroups[agentGroups[queue][i].membername][k];
            if(currentEvent.event === 'PAUSE' || currentEvent.event === 'UNPAUSE'){
              pauseEvents.push(currentEvent);
            }
            if(currentEvent.event === 'REMOVEMEMBER'){
              endings.push(currentEvent);
            }
          }

          //get the very last pause reason.
          const agentOnlyPauseEvents = groupBy(agentEventGroups[agentGroups[queue][i].membername], 'event');
          agentGroups[queue][i].lastPauseReason = null;
          if(agentOnlyPauseEvents.hasOwnProperty('PAUSE')){
            const lastPause = agentOnlyPauseEvents['PAUSE'][agentOnlyPauseEvents['PAUSE'].length - 1];
            agentGroups[queue][i].lastPauseReason = lastPause.data1;
          }


          //loop through pause events to get actual pause detail
          const pauseEventsLength = pauseEvents.length;
          if(pauseEventsLength){
            for (let k = 0; k < pauseEventsLength - 1; k++) {
              const firstGroup = pauseEvents[k];
              const secondGroup = pauseEvents[k + 1];

              //if first group is an unpause just move on
              if (firstGroup.event === 'UNPAUSE') {continue;}

              //if we are on a pause event
              const pauseTime = firstGroup.time;
              const unpauseTime = secondGroup.time;
              const pauseLength = moment.utc(unpauseTime, 'YYYY-MM-DDTHH:mm:ssZ').diff(moment.utc(pauseTime, 'YYYY-MM-DDTHH:mm:ssZ'), 'seconds');
              agentGroups[queue][i].pauseTime += pauseLength;
            }

            if (pauseEvents[pauseEventsLength - 1].event === 'PAUSE') {
              const finalPauseEvent = pauseEvents[pauseEventsLength - 1];
              const finalPauseTime = finalPauseEvent.time;

              //we gotta make sure the member did not leave the queue after this pause
              //if there is a pause event for the final instead of unpause. and a remove member event appears later they left the queue on pause
              //if not it must be a pause that is still active
              //if there are no remove member events the pause must just still be active.
              if(endings.length){
                const finalRemoveMemberEvent = endings[endings.length - 1];
                const finalRemoveTime = finalRemoveMemberEvent.time;

                if(moment(finalRemoveTime).isAfter(finalPauseTime)){
                  const pauseLength = moment.utc(finalRemoveTime, 'YYYY-MM-DDTHH:mm:ssZ').diff(moment.utc(finalPauseTime, 'YYYY-MM-DDTHH:mm:ssZ'), 'seconds');
                  agentGroups[queue][i].pauseTime += pauseLength;
                } else{
                  const timeNowString = moment().format('YYYY-MM-DDTHH:mm:ss');
                  const timeNow = timeNowString + '.000Z';
                  const pauseLength = moment.utc(timeNow).diff(moment.utc(finalPauseTime, 'YYYY-MM-DDTHH:mm:ssZ'), 'seconds');
                  agentGroups[queue][i].pauseTime += pauseLength;
                }
              } else{
                const timeNowString = moment().format('YYYY-MM-DDTHH:mm:ss');
                const timeNow = timeNowString + '.000Z';
                const pauseLength = moment.utc(timeNow).diff(moment.utc(finalPauseTime, 'YYYY-MM-DDTHH:mm:ssZ'), 'seconds');
                agentGroups[queue][i].pauseTime += pauseLength;
              }

            }
          }
        }

      }

      //sort the daily metrics
      const sortedKeys = sortBy(Object.keys(dailyMetrics));
      let sortedDaily = {};
      for (let i = 0; i < sortedKeys.length; i++){
        const dayKey = sortedKeys[i].substr(5);
        sortedDaily[dayKey] = dailyMetrics[sortedKeys[i]];
      }

      //build the final summary data keyed by this queue id.
      summaryData[queue.toString()] = {
        tenantId: queueTenantMap[queue],
        totalCalls,
        outboundCalls,
        inboundCalls,
        inboundComplete,
        outboundComplete,
        inboundTalkTime,
        outboundTalkTime,
        completedCalls,
        abandonedCalls,
        waitTime,
        shortestWait,
        longestWait,
        callDuration,
        abandonRate,
        totalSLA,
        servicelevelperf: serviceLevel,
        agents: agentGroups[queue],
        sortedDaily
      };
    }

  }

  return summaryData;

};
