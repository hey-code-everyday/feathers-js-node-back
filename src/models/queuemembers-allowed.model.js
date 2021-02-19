// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const queuemembers = sequelizeClient.define('queuemembers', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'aq_uniqueid'
    },
    membername: {
      type: DataTypes.STRING,
      field: 'aq_membername'
    },
    queueName: {
      type: DataTypes.INTEGER,
      field: 'aq_queue_name'
    },
    interface: {
      type: DataTypes.STRING,
      field: 'aq_interface'
    },
    stateInterface: {
      type: DataTypes.STRING,
      field: 'aq_state_interface'
    },
    penalty: {
      type: DataTypes.INTEGER,
      field: 'aq_penalty'
    },
    paused: {
      type: DataTypes.INTEGER,
      field: 'aq_paused'
    },
    memberdevice: {
      type: DataTypes.STRING,
      field: 'aq_member_device'
    },
    loggedIn: {
      type: DataTypes.INTEGER,
      field: 'aq_logged_in'
    }
  }, {
    tableName: 'aq_allowed_queue_member',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  queuemembers.associate = function (models) {
  };

  return queuemembers;
};
