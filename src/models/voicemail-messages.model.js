// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const voicemailMessages = sequelizeClient.define('voicemail_messages', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    msgnum: {
      type: DataTypes.STRING,
    },
    dir: {
      type: DataTypes.STRING,
      allowNull: false
    },
    origTime: {
      type: DataTypes.STRING,
      field: 'origtime'
    },
    callerId: {
      type: DataTypes.STRING,
      field: 'callerid'
    },
    duration: {
      type: DataTypes.STRING,
    },
    mailboxuser: {
      type: DataTypes.STRING,
    },
    mailboxContext: {
      type: DataTypes.STRING,
      field: 'mailboxcontext'
    },
    msgId: {
      type: DataTypes.STRING,
      field: 'msg_id'
    }
  }, {
    tableName: 'voicemail_messages',
    timestamps: false
  });


  voicemailMessages.associate = function (models) {
    voicemailMessages.belongsTo(models.voicemails, {foreignKey: 'mailboxuser', targetKey: 'mailbox'});
  };

  return voicemailMessages;
};
