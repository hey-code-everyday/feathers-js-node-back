// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const voxReports = sequelizeClient.define('vox_reports', {
    id: {
      type: DataTypes.INTEGER,
      field: 'vox_re_id',
      primaryKey: true,
      autoIncrement: true
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'vox_re_te_id'
    },
    type: {
      type: DataTypes.STRING,
      field: 'vox_re_type'
    },
    parameters: {
      type: DataTypes.STRING,
      field: 'vox_re_parameters'
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      },
    },
    tableName: 'vox_re_reports',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  voxReports.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return voxReports;
};
