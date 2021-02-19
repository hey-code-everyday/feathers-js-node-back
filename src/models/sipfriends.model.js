const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const sipfriends = sequelizeClient.define(
    'sipfriends',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tenantId: {
        type: DataTypes.INTEGER,
        field: 'te_id',
      },
      accountCode: {
        type: DataTypes.STRING,
        field: 'accountcode',
      },
      callerId: {
        type: DataTypes.STRING,
        field: 'callerid',
      },
      mailbox: {
        type: DataTypes.STRING,
      },
      fullcontact: { type: DataTypes.STRING },
      parkingLot: {
        type: DataTypes.STRING,
        field: 'parkinglot',
      },
      port: {
        type: DataTypes.INTEGER,
      },
      host: {
        type: DataTypes.STRING,
      },
      context: {
        type: DataTypes.STRING,
      },
      transport: {
        type: DataTypes.STRING,
      },
      dtmfMode: {
        type: DataTypes.STRING,
        field: 'dtmfmode',
      },
      nat: {
        type: DataTypes.STRING,
      },
      canReinvite: {
        type: DataTypes.STRING,
        field: 'canreinvite',
      },
      disallow: {
        type: DataTypes.STRING,
      },
      allow: {
        type: DataTypes.STRING,
      },
      insecure: {
        type: DataTypes.STRING,
      },
      trustrpid: {
        type: DataTypes.STRING,
      },
      progressInBand: {
        type: DataTypes.STRING,
        field: 'progressinband',
      },
      setVar: {
        type: DataTypes.STRING,
        field: 'setvar',
      },
      qualify: {
        type: DataTypes.STRING,
      },
      sendrpid: {
        type: DataTypes.STRING,
      },
      qualifyFreq: {
        type: DataTypes.INTEGER,
        field: 'qualifyFreq',
      },
      encryption: {
        type: DataTypes.STRING,
      },
      callLimit: {
        type: DataTypes.INTEGER,
        field: 'call-limit',
      },
      deny: {
        type: DataTypes.STRING,
      },
      dtlscertfile: {
        type: DataTypes.STRING,
      },
      dtlsprivatekey: {
        type: DataTypes.STRING,
      },
      dtlscafile: {
        type: DataTypes.STRING,
      },
      defaultUser: {
        type: DataTypes.STRING,
        field: 'defaultuser',
      },
      secret: {
        type: DataTypes.STRING,
      },
      subscribemwi: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      directMedia: {
        type: DataTypes.STRING,
        field: 'directmedia',
      },
      videoSupport: {
        type: DataTypes.STRING,
        field: 'videosupport',
      },
      maxCallBitrate: {
        type: DataTypes.STRING,
        field: 'maxcallbitrate',
      },
      keepAlive: {
        type: DataTypes.STRING,
        field: 'keepalive',
      },
      directrtpSetup: {
        type: DataTypes.STRING,
        field: 'directrtpsetup',
      },
      trustIdOutbound: {
        type: DataTypes.STRING,
        field: 'trust_id_outbound',
      },
      ciscoUseCallManager: {
        type: DataTypes.STRING,
        field: 'cisco_usecallmanager',
      },
      lastms: {
        type: DataTypes.INTEGER,
      },
      regServer: {
        type: DataTypes.STRING,
        field: 'regserver',
      },
      permit: {
        type: DataTypes.STRING(500),
      },
      language: {
        type: DataTypes.STRING,
      },
      rtpkeepalive: {
        type: DataTypes.INTEGER,
      },
      outboundproxy: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'sipfriends',
      timestamps: false,
    }
  );

  // eslint-disable-next-line no-unused-vars
  sipfriends.associate = function (models) {};

  return sipfriends;
};
