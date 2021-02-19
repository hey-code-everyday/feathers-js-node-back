//query for comparison of this week to last week. OI.

module.exports = async (params, app) => {

  const sequelizeAst = app.get('sequelizeClient');
  const queueIds = Object.keys(params.queueData.queueStats);

  const queueLogRes = await sequelizeAst.query(
    'SELECT \n' +
    '     TIME_FORMAT(time, \'%h%p\') AS hour,\n' +
    '     DATE_FORMAT(time, \'%a\') AS day, \n' +
    '     time, \n' +
    '     agent, \n' +
    '     event, \n' +
    '     queuename, \n' +
    '     data1, \n' +
    '     data2, \n' +
    '     data3, \n' +
    '     data4 \n' +
    'FROM \n' +
    '     queue_log \n' +
    'WHERE \n' +
    '     queuename IN('+ queueIds.join(',') +') \n' +
    '     AND event IN(\'COMPLETECALLER\', \'COMPLETEAGENT\', \'ABANDON\', \'RINGNOANSWER\', \'ATTENDEDTRANSFER\', \'BLINDTRANSFER\') \n' +
    '     AND DATE(time) >= DATE(NOW() - INTERVAL 2 WEEK) AND DATE(time) < DATE(NOW() - INTERVAL 1 WEEK)\n' +
    'GROUP BY \n' +
    '     time, agent, event, queuename \n' +
    'ORDER BY \n' +
    '     time ASC \n;',
    { type: sequelizeAst.QueryTypes.SELECT}
  ).then( res => { return res; });

  //increment total incoming calls per queue and total calls with wait over 2 minutes per queue.
  for(let i = 0; i < queueLogRes.length; i++){
    const isRingNoAnswer = queueLogRes[i]['event'] === 'RINGNOANSWER';
    if(!isRingNoAnswer){
      params.queueData.queueStats[queueLogRes[i]['queuename']].lastWeekTotalIncoming++;
    }
    const isMissEvent = queueLogRes[i]['event'] === 'ABANDON' || queueLogRes[i]['event'] === 'RINGNOANSWER';

    if(!isMissEvent){
      const isTransferEvent = queueLogRes[i]['event'] === 'ATTENDEDTRANSFER' || queueLogRes[i]['event'] === 'BLINDTRANSFER';
      if(isTransferEvent){
        if(queueLogRes[i]['data3'] > 120){
          params.queueData.queueStats[queueLogRes[i]['queuename']].lastWeekOverTwo++;
        }
      } else {
        if(queueLogRes[i]['data1'] > 120){
          params.queueData.queueStats[queueLogRes[i]['queuename']].lastWeekOverTwo++;
        }
      }
    }

  }

  // console.log(params.queueData.queueStats['47']);

  return {
    finalQueueData: params.queueData
  };

};
