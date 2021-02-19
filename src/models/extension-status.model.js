// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const extensionStatus = sequelizeClient.define('extension_status', {
    extension: {
      type: DataTypes.STRING,
      field: 'st_extension',
      primaryKey: true
    },
    state: {
      type: DataTypes.STRING,
      field: 'st_state'
    },
    server: {
      type: DataTypes.STRING,
      field: 'st_peername'
    },
    timestamp: {
      type: DataTypes.DATE,
      field: 'st_timestamp'
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    },
    tableName: 'st_states',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  extensionStatus.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return extensionStatus;
};
