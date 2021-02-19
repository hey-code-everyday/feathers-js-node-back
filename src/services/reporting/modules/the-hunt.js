const groupBy = require('lodash/groupBy');

/* eslint-disable */
module.exports = async (params, app) => {

  const { tenantId, interval, tenantCode } = params;
  const sequelize = app.get('sequelizeClient');
  const sequelizeCDR = app.get('sequelizeClientCDR');
  let huntListData = {};

  //METRIC NEEDED ARE INBOUND / OUTBOUND VOLUMES AND DURATIONS
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

  //query HUNT LISTS AND JOIN THE DESTINATIONS
  const huntLists = await sequelize.query(
    "SELECT " +
      "hu_huntlists.hu_id, " +
      "hu_huntlists.hu_name, " +
      "hu_huntlists.hu_te_id, " +
      "hu_huntlists.hu_type, " +
      "de_destinations.de_type_id_src, " +
      "ex_extensions.ex_id, " +
      "ex_extensions.ex_number, " +
      "ex_extensions.ex_name " +
    "FROM " +
      "hu_huntlists " +
    "INNER JOIN " +
      "de_destinations on de_destinations.de_type_id_src = hu_huntlists.hu_id " +
    "INNER JOIN " +
      "ex_extensions on ex_extensions.ex_id = de_destinations.de_type_id_dst " +
    "WHERE " +
      "de_destinations.de_type_src = 'HUNTLIST' " +
      "AND de_destinations.de_type_dst = 'EXT' " +
      "AND de_destinations.de_te_id = '"+tenantId+"';",
    {type: sequelize.QueryTypes.SELECT}
  );

  //incoming calls
  const cdrQuery = await sequelizeCDR.query(
    "SELECT " +
      "duration, " +
      "realsrc, " +
      "wherelanded " +
    "FROM " +
      "cdr " +
    "WHERE " +
      "accountcode='"+tenantCode+"' " +
      "AND disposition='ANSWERED' " +
      "AND realsrc LIKE '%Hunt List%'" +
      "AND DATE(start) "+query_interval+"" +
      "AND DATE(start) < DATE(NOW());",
    {type: sequelizeCDR.QueryTypes.SELECT}
  );

  //outbound calls for all extensions
  const allExtensions = Object.keys(groupBy(huntLists, 'ex_number'));
  const outgoingQuery = await sequelizeCDR.query(
    "SELECT " +
      "sc_calleridnum, " +
      "sc_calleridname, " +
      "sc_duration " +
    "FROM " +
      "sc_simplecdr " +
    "WHERE " +
      "sc_te_id='"+tenantId+"' " +
      "AND DATE(sc_start) "+query_interval+"" +
      "AND sc_start < DATE(NOW()) " +
      "AND sc_calleridnum IN("+allExtensions+")" +
      "AND sc_disposition='ANSWERED' " +
      "AND sc_direction='OUT';",
    {type: sequelizeCDR.QueryTypes.SELECT}
  );

  //results groups by keys of interest
  const keyedById = groupBy(huntLists, 'hu_id');
  const incomingByHuntList = groupBy(cdrQuery, 'realsrc');
  const outgoingByExtension = groupBy(outgoingQuery, 'sc_calleridnum');

  const huntListIds = Object.keys(keyedById);
  let HuntlistNameIdKey = {};
  let extNameKey = {};
  for(let huntList in keyedById){
    if(keyedById.hasOwnProperty(huntList)){
      HuntlistNameIdKey[keyedById[huntList][0].hu_id] = keyedById[huntList][0].hu_name;
      for(let i = 0; i < keyedById[huntList].length; i++){
        extNameKey[keyedById[huntList][i].ex_number] = keyedById[huntList][i].ex_name;
      }
    }
  }

  //console.log(extNameKey);

  //build outbound info for reference in huntlist loop
  let outboundStats = {};
  for(let agent in outgoingByExtension){
    if(outgoingByExtension.hasOwnProperty(agent)){
      let agentOutboundTotal = 0;
      let agentOutboundDuration = 0;
      for(let i = 0; i < outgoingByExtension[agent].length; i++){
        const currentGroup = outgoingByExtension[agent][i];
        agentOutboundTotal++;
        agentOutboundDuration += +currentGroup.sc_duration;
      }
      outboundStats[agent] = {
        totalCalls: agentOutboundTotal,
        totalDuration: agentOutboundDuration
      }
    }
  }

  for(let i = 0; i < huntListIds.length; i++){

    //these are the extensions tied to the hunt list (initialize stats array)
    let agents = {};
    let outboundTotal = 0;
    let outboundDuration = 0;
    const extNumbers = Object.keys(groupBy(keyedById[huntListIds[i]], 'ex_number'));
    for(let j = 0; j < extNumbers.length; j++){
      agents[extNumbers[j]] = {
        name: extNameKey[extNumbers[j]],
        totalIncoming: 0,
        incomingDuration: 0,
        totalOutbound: 0,
        outboundDuration: outboundStats.hasOwnProperty(extNumbers[j]) ? outboundStats[extNumbers[j]].totalDuration : 0
      }
      if(outboundStats.hasOwnProperty(extNumbers[j])){
        agents[extNumbers[j]].totalOutbound = outboundStats[extNumbers[j]].totalCalls;
        agents[extNumbers[j]].outboundDuration = outboundStats[extNumbers[j]].totalDuration;
        outboundTotal += outboundStats[extNumbers[j]].totalCalls;
        outboundDuration += outboundStats[extNumbers[j]].totalDuration;
      }
    }

    //figure out the total number of incoming hunt list calls this is just the length of each list in incomingByHuntList
    let totalIncoming = 0;
    let incomingDuration = 0;
    if(incomingByHuntList.hasOwnProperty('Hunt List '+HuntlistNameIdKey[huntListIds[i]])){
      const currentGroup = incomingByHuntList['Hunt List '+HuntlistNameIdKey[huntListIds[i]]];
      totalIncoming = currentGroup.length;
      for(let k = 0; k < totalIncoming; k++){
        incomingDuration += +currentGroup[k].duration;
        if(agents.hasOwnProperty(currentGroup[k].wherelanded)){
          agents[currentGroup[k].wherelanded].totalIncoming++;
          agents[currentGroup[k].wherelanded].incomingDuration += currentGroup[k].duration;
        }
      }
    }

    huntListData[huntListIds[i].toString()] = {
      name: HuntlistNameIdKey[huntListIds[i]],
      totalIncoming,
      incomingDuration,
      outboundTotal,
      outboundDuration,
      agents
    }

  }
  //console.log(huntListData);

  return huntListData;
};
