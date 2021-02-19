exports.duplicateLogElim = function () {
  return async context => {

    context.params.sequelize = {
      group: ['time', 'agent', 'event', 'queuename']
    };

    return context;
  };
};
