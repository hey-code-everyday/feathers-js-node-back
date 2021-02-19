const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const voicemails = sequelizeClient.define(
    'voicemails',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'uniqueid',
        autoIncrement: true,
      },
      context: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mailbox: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      fullName: {
        type: DataTypes.STRING,
        field: 'fullname',
      },
      email: {
        type: DataTypes.STRING,
      },
      tenantId: {
        type: DataTypes.INTEGER,
        field: 'te_id',
      },
      pager: {
        type: DataTypes.STRING,
      },
      attach: {
        type: DataTypes.STRING,
      },
      welcomeoption: {
        type: DataTypes.STRING,
      },
      tz: {
        type: DataTypes.STRING,
      },
      tzbytenant: {
        type: DataTypes.STRING,
      },
      deleteVoicemail: {
        type: DataTypes.STRING,
      },
      language: {
        type: DataTypes.STRING,
      },
      maxmsg: {
        type: DataTypes.STRING,
      },
      exitcontext: {
        type: DataTypes.STRING,
      },
      operator: {
        type: DataTypes.STRING,
      },
      minsecs: {
        type: DataTypes.STRING,
      },
      envelope: {
        type: DataTypes.STRING,
      },
      saycid: {
        type: DataTypes.STRING,
      },
      review: {
        type: DataTypes.STRING,
      },
      maxsecs: {
        type: DataTypes.STRING,
      },
      transcriptStore: {
        type: DataTypes.STRING,
        field: 'transcript_store',
      },
      nextaftercmd: {
        type: DataTypes.STRING,
      },
      category: {
        type: DataTypes.STRING,
      },
      onnewmessageparam1: {
        type: DataTypes.STRING,
      },
      onnewmessageparam2: {
        type: DataTypes.STRING,
      },
      onnewmessageparam3: {
        type: DataTypes.STRING,
      },
      ivrId: {
        type: DataTypes.STRING,
        field: 'ivr_id',
      },
    },
    {
      tableName: 'voicemail',
      timestamps: false,
    }
  );

  voicemails.associate = function (models) {
    voicemails.belongsTo(models.tenants, { foreignKey: 'tenantId' });
    voicemails.hasMany(models.voicemail_messages, {
      foreignKey: 'mailboxuser',
      sourceKey: 'mailbox',
    });
    voicemails.hasMany(models.destinations, {
      as: 'de_destinations',
      foreignKey: 'de_type_id_src',
    });
  };

  return voicemails;
};
