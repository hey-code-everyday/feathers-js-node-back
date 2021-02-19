// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const devices = sequelizeClient.define(
    'devices',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'ph_id',
      },
      name: {
        type: DataTypes.STRING,
        field: 'ph_name',
      },
      mac: {
        type: DataTypes.STRING,
        field: 'ph_mac',
      },
      tenantId: {
        type: DataTypes.INTEGER,
        field: 'ph_te_id',
      },
      password: {
        type: DataTypes.STRING,
        field: 'ph_password',
      },
      phLine1ExId: {
        type: DataTypes.INTEGER,
        field: 'ph_line1_ex_id',
      },
      phPmId: {
        type: DataTypes.INTEGER,
        field: 'ph_pm_id',
      },
      filename: {
        type: DataTypes.STRING,
        field: 'ph_filename',
      },
    },
    {
      tableName: 'ph_phones',
      timestamps: false,
    }
  );

  // additional relationship for device model will go here as well
  devices.associate = function (models) {
    devices.belongsTo(models.tenants, { foreignKey: 'tenantId' });
    devices.belongsTo(models.extensions, { foreignKey: 'ph_line1_ex_id' });
    devices.belongsTo(models.device_models, { foreignKey: 'ph_pm_id' });
    devices.hasMany(models.autoprovision_values, { foreignKey: 'av_ph_id' });
    devices.hasMany(models.phone_phonebooks, { foreignKey: 'pp_ph_id' });
  };

  return devices;
};
