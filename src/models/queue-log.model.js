// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const queueLog = sequelizeClient.define('queue_log', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    time: {
      type: DataTypes.STRING
    },
    callId: {
      type: DataTypes.STRING,
      field: 'callid'
    },
    queueId: {
      type: DataTypes.STRING,
      field: 'queuename'
    },
    agent: {
      type: DataTypes.STRING
    },
    event: {
      type: DataTypes.STRING
    },
    data1: {
      type: DataTypes.STRING
    },
    data2: {
      type: DataTypes.STRING
    },
    data3: {
      type: DataTypes.STRING
    },
    data4: {
      type: DataTypes.STRING
    },
    data5: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'queue_log',
    timestamps: false,
    hooks: {
      beforeCount(options) {
        options.raw = false;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  queueLog.associate = function (models) {

  };

  return queueLog;
};
