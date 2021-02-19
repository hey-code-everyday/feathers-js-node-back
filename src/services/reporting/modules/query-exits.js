//this queries the queues and destinations of exits by key
const dstModelRef = require('../../../ref/dst-models-reference');
const deRef = require('../../../ref/destinations-reference');
const dstNameFields = require('../../../ref/dst-name-fields');

/*eslint-disable */
module.exports = async (app, queueStats) => {


  //query the qu_queues and join on queues table
  const sequelizeAst = app.get('sequelizeClient');
  const Models = sequelizeAst.models;

  //all the queue ids
  const queueIds = Object.keys(queueStats);

  // console.log(queueIds);

  let queueRes = await sequelizeAst.query(
    "SELECT\n" +
    "   qu_queues.qu_id,\n" +
    "   qu_queues.qu_ivr_id,\n" +
    "   queue.context\n" +
    "FROM\n" +
    "   qu_queues\n" +
    "   LEFT JOIN queue ON queue.name = qu_queues.qu_id\n" +
    "WHERE\n" +
    "   qu_queues.qu_id IN("+ queueIds.join(',') +")",
    {type: sequelizeAst.QueryTypes.SELECT}
  );

  //intialize the exitInfo with All Queues
  const exitInfo = {};
  for(let i = 0; i<queueIds.length; i++){
    exitInfo[queueIds[i]] = [];
  }

  //loop through results here
  for(let i = 0; i<queueRes.length; i++){

    if(queueRes[i].context.length){
      const contextValue = queueRes[i].context.split('_')[1];

      if(contextValue === 'IVR'){
        const ivrId = queueRes[i].qu_ivr_id;

        //query all the ivr destinations and replace info keys with reason
        const destRes = await app.service('destinations').find({
          paginate: false,
          query: {
            typeSrc: {$in: deRef.IVR},
            typeIdSrc: ivrId,
            order: '1'
          }
        });

        for(let k = 0; k<destRes.length; k++){

          const contextKey = parseInt(destRes[k].typeSrc.split('_')[1]);

          if(!Number.isNaN(contextKey)){
            // console.log(contextKey);

            const dstModel = dstModelRef(destRes[0].typeDst, Models);
            const dstNameField = dstNameFields(destRes[0].typeDst);

            const dstRecord = await dstModel.findOne({
              raw: true,
              where: {
                id: destRes[0].typeIdDst
              }
            });

            if(queueStats[queueRes[i].qu_id].exitsByKey[contextKey] > 0){
              exitInfo[queueRes[i].qu_id].push({
                destination: `${dstNameField.prefix} ${dstRecord[dstNameField.field]}`,
                count: queueStats[queueRes[i].qu_id].exitsByKey[contextKey]
              });
            }
          }

        }

      } else {

        //query the EXITWITHKEY destination
        const destRes = await app.service('destinations').find({
          paginate: false,
          query: {
           typeSrc: 'QUEUE-EXITKEY',
           typeIdSrc: queueRes[i].qu_id
          }
        });

        const dstModel = dstModelRef(destRes[0].typeDst, Models);
        const dstNameField = dstNameFields(destRes[0].typeDst);

        const dstRecord = await dstModel.findOne({
          raw: true,
          where: {
            id: destRes[0].typeIdDst,
          }
        });

        exitInfo[queueRes[i].qu_id].push({
          destination: `${dstNameField.prefix} ${dstRecord[dstNameField.field]}`,
          count: queueStats[queueRes[i].qu_id].exitsByKey[contextValue]
        });

      }

    }

  }

  return exitInfo;

};
