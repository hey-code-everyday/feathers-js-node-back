//query for comparison of last month vs this month.


module.exports = async (params, app) => {

  const sequelizeAst = app.get('sequelizeClient');
  const queueIds = Object.keys(params.queueData.queueStats);

  const queueLogRes = await sequelizeAst.query(
    'SELECT \n' +
    '     id, \n' +
    '     queuename \n' +
    'FROM \n' +
    '     queue_log \n' +
    'WHERE \n' +
    '     queuename IN('+ queueIds.join(',') +') \n' +
    '     AND event IN(\'COMPLETECALLER\', \'COMPLETEAGENT\') \n' +
    '     AND data1 > 120 \n' +
    '     AND DATE(time) >= DATE(NOW() - INTERVAL 2 MONTH) AND DATE(time) < DATE(NOW() - INTERVAL 1 MONTH)\n' +
    'GROUP BY \n' +
    '     time, agent, event, queuename \n;',
    { type: sequelizeAst.QueryTypes.SELECT}
  ).then( res => { return res; });

  const queueLogTransferRes = await sequelizeAst.query(
    'SELECT \n' +
    '     id, \n' +
    '     queuename \n' +
    'FROM \n' +
    '     queue_log \n' +
    'WHERE \n' +
    '     queuename IN('+ queueIds.join(',') +') \n' +
    '     AND event IN(\'ATTENDEDTRANSFER\', \'BLINDTRANSFER\') \n' +
    '     AND data3 > 120 \n' +
    '     AND DATE(time) >= DATE(NOW() - INTERVAL 2 MONTH) AND DATE(time) < DATE(NOW() - INTERVAL 1 MONTH)\n' +
    'GROUP BY \n' +
    '     time, agent, event, queuename \n;',
    { type: sequelizeAst.QueryTypes.SELECT}
  ).then( res => { return res; });

  //increment total incoming calls per queue and total calls with wait over 2 minutes per queue.
  for(let i = 0; i < queueLogRes.length; i++){
    params.queueData.queueStats[queueLogRes[i]['queuename']].lastMonthOverTwo++;
  }

  //increment calls over two based on transfer completions
  for(let i = 0; i < queueLogTransferRes.length; i++){
    params.queueData.queueStats[queueLogTransferRes[i]['queuename']].lastMonthOverTwo++;
  }

  return {
    finalQueueData: params.queueData
  };

};
