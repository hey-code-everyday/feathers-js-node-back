// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const queueManagers = sequelizeClient.define('queue_managers', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'qm_id',
      autoIncrement: true
    },
    queueId: {
      type: DataTypes.INTEGER,
      field: 'qm_qu_id'
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'qm_us_id'
    }
  }, {
    tableName: 'qm_queues_managers',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  queueManagers.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return queueManagers;
};
