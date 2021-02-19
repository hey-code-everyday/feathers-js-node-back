const getDstModel = require('../../../ref/dst-models-reference');

exports.addDestinations = function () {
  return async context => {

    const sequelize = context.app.get('sequelizeClient');
    const Models = sequelize.models;
    const {de_destinations} = context.result;

    //nest the actual destination for each de_destinations record.
    for (let i = 0; i < de_destinations.length; i++) {

      let dstModel = getDstModel(de_destinations[i].typeDst, Models);
      let queryModel = await getModel(de_destinations[i], dstModel);

      if (queryModel) {
        context.result.de_destinations[i].destination = queryModel;
      }
    }

    // accepts the destination and the model we need to query (model comes from dst-models-reference file)
    async function getModel(dest, model) {

      const {typeIdDst} = dest;

      return await
      model.findOne({
        raw: true,
        where: {
          id: typeIdDst,
        }
      }).then(model => model);
    }

    return context;
  };
};
