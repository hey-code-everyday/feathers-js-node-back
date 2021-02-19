// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const queues = sequelizeClient.define('queues', {
    id: {
      type: DataTypes.INTEGER,
      field: 'qu_id',
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      field: 'qu_name'
    },
    hostServer: {
      type: DataTypes.STRING,
      field: 'qu_hosted'
    },
    number: {
      type: DataTypes.STRING,
      field: 'qu_number'
    },
    server: {
      type: DataTypes.STRING,
      field: 'qu_hosted'
    },
    recording: {
      type: DataTypes.STRING,
      field: 'qu_alwaysrecord'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'qu_te_id'
    }
  }, {
    tableName: 'qu_queues',
    timestamps: false,
    hooks: {
      beforeCount(options) {
        options.raw = false;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  queues.associate = function (models) {
    queues.belongsTo(models.tenants, {foreignKey: 'tenantId'});
  };

  return queues;
};
