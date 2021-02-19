const groupBy = require('lodash/groupBy');
const moment = require('moment');

module.exports = async (ids, app, start) => {

  //queue logs for the login/logout events
  const logs = await app.service('queue-log').find({
    paginate: false,
    query: {
      queueId: {$in: ids},
      event: {$in: ['LOGIN', 'LOGOUT']},
      time: {$gte: start, $lte: moment(start).add(1, 'days').format('YYYY-MM-DD')}
    }
  });

  const queueGroups = groupBy(logs, 'queueId');

  //loop through queues and build up the stats
  let workHours = {};
  for(let queue in queueGroups){
    if(queueGroups.hasOwnProperty(queue)){
      const queueGroup = queueGroups[queue];
      //initialize queue object
      workHours[queue] = [];

      const agentGroups = groupBy(queueGroup, 'agent');
      for(let agent in agentGroups){
        if(agentGroups.hasOwnProperty(agent)){
          const currentAgent = agentGroups[agent];

          const eventGroups = groupBy(currentAgent, 'event');

          let firstLogin = 'N/A';
          let lastLogout = 'N/A';
          let workDay = 'N/A';

          if(eventGroups.hasOwnProperty('LOGIN')){
            firstLogin = eventGroups['LOGIN'][0].time;
          }

          if(eventGroups.hasOwnProperty('LOGOUT')){
            const logoutLength = eventGroups['LOGOUT'].length;
            lastLogout = eventGroups['LOGOUT'][logoutLength - 1].time;
          }

          if(firstLogin !== 'N/A' && lastLogout !== 'N/A'){
            const sessionLength = moment(lastLogout).diff(moment(firstLogin), 'seconds');
            const duration = moment.duration(sessionLength, 'seconds');
            const hours = duration.get('hours');
            const minutes = duration.get('minutes') < 10 ? '0'+duration.get('minutes') : duration.get('minutes');
            workDay = `${hours}hr ${minutes}min`;
          }

          workHours[queue].push({
            agent,
            login: firstLogin,
            logout: lastLogout,
            workDay
          });
        }
      }
    }
  }

  return workHours;

};
