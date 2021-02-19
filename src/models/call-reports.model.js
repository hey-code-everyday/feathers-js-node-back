// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClientCDR');
  const callReports = sequelizeClient.define('call_reports', {
    id: {
      type: DataTypes.INTEGER,
      field: 'sc_id',
      primaryKey: true,
      autoIncrement: true
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'sc_te_id'
    },
    direction: {
      type: DataTypes.STRING,
      field: 'sc_direction'
    },
    start: {
      type: DataTypes.STRING,
      field: 'sc_start'
    },
    callerIdNumber: {
      type: DataTypes.STRING,
      field: 'sc_calleridnum'
    },
    callerIdName: {
      type: DataTypes.STRING,
      field: 'sc_calleridname'
    },
    dialedNum: {
      type: DataTypes.STRING,
      field: 'sc_dialednum'
    },
    disposition: {
      type: DataTypes.STRING,
      field: 'sc_disposition'
    },
    duration: {
      type: DataTypes.INTEGER,
      field: 'sc_duration'
    },
    uniqueId: {
      type: DataTypes.STRING,
      field: 'sc_uniqueid'
    },
    whoAnswered: {
      type: DataTypes.STRING,
      field: 'sc_whoanswered'
    }
  }, {
    tableName: 'sc_simplecdr',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  callReports.associate = function (models) {

  };

  return callReports;
};
