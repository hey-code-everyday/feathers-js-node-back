// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const deviceModels = sequelizeClient.define('device_models', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'pm_id'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'pm_name'
    },
    remotePostUrl: {
      type: DataTypes.STRING,
      field: 'pm_remoteposturl'
    },
    remotePostUser: {
      type: DataTypes.STRING,
      field: 'pm_remotepostuser'
    },
    remotePostPassword: {
      type: DataTypes.STRING,
      field: 'pm_remotepostpassword'
    },
    mac: {
      type: DataTypes.STRING,
      field: 'pm_mac'
    },
    remotePost: {
      type: DataTypes.STRING,
      field: 'pm_remotepost'
    }
  }, {
    tableName: 'pm_phonemodels',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  deviceModels.associate = function (models) {
    deviceModels.hasOne(models.devices, {foreignKey: 'ph_pm_id'});
  };

  return deviceModels;
};
