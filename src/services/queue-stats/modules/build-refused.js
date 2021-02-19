const groupBy = require('lodash/groupBy');

module.exports = async (ids, app, start, end) => {

  //get ids of ring no answer calls.
  const callIds = [];
  const logs = await app.service('queue-log').find({
    paginate: false,
    query: {
      queueId: {$in: ids},
      event: 'RINGNOANSWER',
      time: {$gte: start, $lte: end}
    }
  });
  const resultLength = logs.length;
  for(let i = 0; i < resultLength; i++){
    if(!callIds.includes(logs[i].callId)){
      callIds.push(logs[i].callId);
    }
  }

  const enterLogs = await app.service('queue-log').find({
    paginate: false,
    query: {
      queueId: {$in: ids},
      event: {$in: ['ENTERQUEUE', 'CONNECT']},
      callId: {$in: callIds}
    }
  });

  const callIdGroups = groupBy(enterLogs, 'callId');

  for (let i = 0; i < enterLogs.length; i++){
    enterLogs[i].disposition = 'Unanswered';
    const key = enterLogs[i].callId;
    if(callIdGroups.hasOwnProperty(key)){
      if(callIdGroups[key].length > 1){
        enterLogs[i].disposition = 'Answered';
      }
    }
  }


  let payload = enterLogs.filter( (item) => {
    return item.event === 'ENTERQUEUE';
  });

  return groupBy(payload, 'queueId');

};
