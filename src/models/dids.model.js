
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const dids = sequelizeClient.define('dids', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'di_id',
      autoIncrement: true
    },
    number: {
      type: DataTypes.STRING,
      field: 'di_number'
    },
    recording: {
      type: DataTypes.TEXT,
      field: 'di_recording'
    },
    fax: {
      type: DataTypes.TEXT,
      field: 'di_fax'
    },
    faxProtocol: {
      type: DataTypes.TEXT,
      field: 'di_faxprotocol'
    },
    faxEmail: {
      type: DataTypes.STRING,
      field: 'di_fax_email'
    },
    faxStore: {
      type: DataTypes.TEXT,
      field: 'di_fax_store'
    },
    namePrefix: {
      type: DataTypes.STRING,
      field: 'di_didnameprefix'
    },
    unconditionalStatus: {
      type: DataTypes.STRING,
      field: 'di_unconditionalstatus'
    },
    cnam: {
      type: DataTypes.TEXT,
      field: 'di_cnam'
    },
    allowEmergency: {
      type: DataTypes.STRING,
      field: 'di_allowemergency'
    },
    emergencyNotes: {
      type: DataTypes.STRING,
      field: 'di_emergencynotes'
    },
    ibid: {
      type: DataTypes.STRING,
      field: 'di_ibid'
    },
    emailRecording: {
      type: DataTypes.STRING,
      field: 'di_emailrecording'
    },
    smsStore: {
      type: DataTypes.STRING,
      field: 'di_sms_store'
    },
    smsEmail: {
      type: DataTypes.STRING,
      field: 'di_smsemail'
    },
    branch: {
      type: DataTypes.STRING,
      field: 'di_branch'
    },
    department: {
      type: DataTypes.STRING,
      field: 'di_department'
    },
    storeForwardNumber: {
      type: DataTypes.STRING,
      field: 'di_storeandforwardnumber'
    },
    smsAnswer: {
      type: DataTypes.STRING,
      field: 'di_smsanswer'
    },
    diCommentName: {
      type: DataTypes.STRING,
      field: 'di_comment'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'di_te_id'
    },
    di_country: {
      type: DataTypes.STRING
    },
    di_area: {
      type: DataTypes.STRING
    },
    di_didprefix: {
      type: DataTypes.STRING
    },
    di_faxstationid: {
      type: DataTypes.STRING
    },
    di_faxheaderinfo: {
      type: DataTypes.STRING
    },
    di_admincomment: {
      type: DataTypes.STRING
    },
    di_minemailrecording: {
      type: DataTypes.STRING
    },
    di_notifymaxchannels: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'di_dids',
    timestamps: false,
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  dids.associate = function (models) {

  };

  return dids;
};
