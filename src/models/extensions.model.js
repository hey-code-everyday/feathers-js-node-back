// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const extensions = sequelizeClient.define(
    'extensions',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'ex_id',
      },
      name: {
        type: DataTypes.STRING,
        field: 'ex_name',
      },
      number: {
        type: DataTypes.STRING,
        field: 'ex_number',
      },
      cidNum: {
        type: DataTypes.STRING,
        field: 'ex_cidnum',
      },
      cidName: {
        type: DataTypes.STRING,
        field: 'ex_cidname',
      },
      email: {
        type: DataTypes.STRING,
        field: 'ex_email',
      },
      unconditionalStatus: {
        type: DataTypes.STRING,
        field: 'ex_unconditionalstatus',
      },
      dnd: {
        type: DataTypes.STRING,
        field: 'ex_dnd',
      },
      emergencyCidNum: {
        type: DataTypes.STRING,
        field: 'ex_emergencycidnum',
      },
      branch: {
        type: DataTypes.STRING,
        field: 'ex_branch',
      },
      department: {
        type: DataTypes.STRING,
        field: 'ex_department',
      },
      tenantId: {
        type: DataTypes.INTEGER,
        field: 'ex_te_id',
      },
      tech: {
        type: DataTypes.STRING,
        field: 'ex_tech',
      },
      techId: {
        type: DataTypes.INTEGER,
        field: 'ex_tech_id',
      },
      dateCreation: {
        type: DataTypes.DATE,
        field: 'ex_datecreation',
      },
      cidUsage: {
        type: DataTypes.INTEGER,
        field: 'ex_cidusage',
      },
      blockcid: {
        type: DataTypes.STRING,
        field: 'ex_blockcid',
      },
      prefix: {
        type: DataTypes.STRING,
        field: 'ex_prefix',
      },
      minDigitPrefix: {
        type: DataTypes.INTEGER,
        field: 'ex_mindigitprefix',
      },
      maxDigitPrefix: {
        type: DataTypes.INTEGER,
        field: 'ex_maxdigitprefix',
      },
      fmfmStatus: {
        type: DataTypes.STRING,
        field: 'ex_fmfmstatus',
      },
      fmfmNumPrefix: {
        type: DataTypes.STRING,
        field: 'ex_fmfmnumprefix',
      },
      fmfmNumber: {
        type: DataTypes.STRING,
        field: 'ex_fmfmnumber',
      },
      fmfmDialTimeout: {
        type: DataTypes.INTEGER,
        field: 'ex_fmfmdialtimeout',
      },
      fmfmDialMethod: {
        type: DataTypes.STRING,
        field: 'ex_fmfmdialmethod',
      },
      fmfmCallerId: {
        type: DataTypes.STRING,
        field: 'ex_fmfmcallerid',
      },
      fmfmNamePrefix: {
        type: DataTypes.STRING,
        field: 'ex_fmfmnameprefix',
      },
      fmfmConfirm: {
        type: DataTypes.STRING,
        field: 'ex_fmfmconfirm',
      },
      fmfmConfirmMessageId: {
        type: DataTypes.INTEGER,
        field: 'ex_fmfmconfirmmessage_id',
      },
      fmfmHoldMessageId: {
        type: DataTypes.INTEGER,
        field: 'ex_fmfmholdmessage_id',
      },
      dialTimeout: {
        type: DataTypes.STRING,
        field: 'ex_dialtimeout',
      },
      callGroup: {
        type: DataTypes.INTEGER,
        field: 'ex_callgroup',
      },
      pickupGroup: {
        type: DataTypes.INTEGER,
        field: 'ex_pickupgroup',
      },
      onBusyStatus: {
        type: DataTypes.STRING,
        field: 'ex_onbusystatus',
      },
      onOfflineStatus: {
        type: DataTypes.STRING,
        field: 'ex_onofflinestatus',
      },
      onNoAnswerStatus: {
        type: DataTypes.STRING,
        field: 'ex_onnoanswerstatus',
      },
      rpid: {
        type: DataTypes.INTEGER,
        field: 'ex_rp_id',
      },
      webPassword: {
        type: DataTypes.STRING,
        field: 'ex_webpassword',
      },
      upid: {
        type: DataTypes.INTEGER,
        field: 'ex_up_id',
      },
      userPanel: {
        type: DataTypes.STRING,
        field: 'ex_userpanel',
      },
      recording: {
        type: DataTypes.STRING,
        field: 'ex_recording',
      },
      emailRecording: {
        type: DataTypes.STRING,
        field: 'ex_emailrecording',
      },
      mineMailRecording: {
        type: DataTypes.INTEGER,
        field: 'ex_minemailrecording',
      },
      trunkCidOverride: {
        type: DataTypes.STRING,
        field: 'ex_trunkcidoverride',
      },
      trunk: {
        type: DataTypes.STRING,
        field: 'ex_trunk',
      },
      trunkEmergencyCidOverride: {
        type: DataTypes.STRING,
        field: 'ex_trunkemergencycidoverride',
      },
      crid: {
        type: DataTypes.INTEGER,
        field: 'ex_cr_id',
      },
      trunkCidSource: {
        type: DataTypes.STRING,
        field: 'ex_trunkcidsource',
      },
      notifyMissingEmail: {
        type: DataTypes.STRING,
        field: 'ex_notifymissingemail',
      },
      webUseldap: {
        type: DataTypes.STRING,
        field: 'ex_webuseldap',
      },
      faxGateway: {
        type: DataTypes.STRING,
        field: 'ex_faxgateway',
      },
      includeInPb: {
        type: DataTypes.STRING,
        field: 'ex_includeinpb',
      },
      regexPrefix: {
        type: DataTypes.STRING,
        field: 'ex_regexprefix',
      },
      muId: {
        type: DataTypes.INTEGER,
        field: 'ex_mu_id',
      },
    },
    {
      tableName: 'ex_extensions',
      timestamps: false,
      hooks: {
        beforeCount(options) {
          options.raw = false;
        },
      },
    }
  );

  // eslint-disable-next-line no-unused-vars
  extensions.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return extensions;
};
