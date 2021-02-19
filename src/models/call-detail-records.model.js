// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClientCDR');
  const callDetailRecords = sequelizeClient.define('call_detail_records', {
    id: {
      type: DataTypes.INTEGER,
      field: 'ID',
      primaryKey: true,
      autoIncrement: true
    },
    tenantCode: {
      type: DataTypes.STRING,
      field: 'accountcode'
    },
    whereLanded: {
      type: DataTypes.STRING,
      field: 'wherelanded'
    },
    userField: {
      type: DataTypes.STRING,
      field: 'userfield'
    },
    start: {
      type: DataTypes.DATE
    },
    answer: {
      type: DataTypes.DATE
    },
    end: {
      type: DataTypes.DATE
    },
    talkTime: {
      type: DataTypes.STRING,
      field: 'billsec'
    },
    totalTime: {
      type: DataTypes.STRING,
      field: 'duration'
    },
    from: {
      type: DataTypes.STRING,
      field: 'src'
    },
    callerId: {
      type: DataTypes.STRING,
      field: 'clid'
    },
    disposition: {
      type: DataTypes.STRING
    },
    lastdst: {
      type: DataTypes.STRING
    },
    uniqueId: {
      type: DataTypes.STRING,
      field: 'uniqueid'
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    },
    tableName: 'cdr',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  callDetailRecords.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return callDetailRecords;
};
