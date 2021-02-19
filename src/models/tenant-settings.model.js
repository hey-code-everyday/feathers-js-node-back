// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const tenantSettings = sequelizeClient.define('tenant_settings', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'se_id',
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING,
      field: 'se_code'
    },
    value: {
      type: DataTypes.STRING,
      field: 'se_value'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'se_te_id'
    }
  }, {
    tableName: 'se_settings',
    timestamps: false,
    hooks: {
      beforeCount(options) {
        options.raw = false;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  tenantSettings.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return tenantSettings;
};
