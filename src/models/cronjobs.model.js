// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const cronjobs = sequelizeClient.define('cronjobs', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'cr_id'
    },
    type: {
      type: DataTypes.STRING,
      field: 'cr_type'
    },
    name: {
      type: DataTypes.STRING,
      field: 'cr_name'
    },
    active: {
      type: DataTypes.STRING,
      field: 'cr_active'
    },
    minute: {
      type: DataTypes.STRING,
      field: 'cr_minute'
    },
    hour: {
      type: DataTypes.STRING,
      field: 'cr_hour'
    },
    weekday: {
      type: DataTypes.STRING,
      field: 'cr_weekday'
    },
    lastStarted: {
      type: DataTypes.STRING,
      field: 'cr_laststarted'
    },
    lastEnded: {
      type: DataTypes.STRING,
      field: 'cr_lastended'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'cr_te_id'
    }
  }, {
    tableName: 'cr_cronjobs',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  cronjobs.associate = function (models) {
    cronjobs.hasMany(models.destinations, {as: 'de_destinations', foreignKey: 'de_type_id_src'});
    cronjobs.belongsTo(models.tenants, {foreignKey: 'tenantId'});
  };

  return cronjobs;
};
