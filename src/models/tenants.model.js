// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const tenants = sequelizeClient.define('tenants', {
    id: {
      type: DataTypes.INTEGER,
      field: 'te_id',
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      field: 'te_name',
    },
    timeZone: {
      type: DataTypes.STRING,
      field: 'te_timezone'
    },
    tenantCode: {
      type: DataTypes.STRING,
      field: 'te_code'
    },
    alertEmail: {
      type: DataTypes.STRING,
      field: 'te_alertemail'
    },
    paymentType: {
      type: DataTypes.STRING,
      field: 'te_payment_type'
    },
    disabled: {
      type: DataTypes.INTEGER,
      field: 'te_disabled'
    },
    maxChannels: {
      type: DataTypes.INTEGER,
      field: 'te_maxchannels'
    },
    allowAnyCallerIdForEmerg: {
      type: DataTypes.STRING,
      field: 'te_allowanycalleridforemerg'
    },
    te_cl_id: {
      type:DataTypes.INTEGER
    },
    te_rp_id: {
      type: DataTypes.INTEGER
    },
    te_billingcode: {
      type:DataTypes.STRING
    },
    te_provisioningdir: {
      type:DataTypes.STRING
    },
    te_recordingstorage: {
      type: DataTypes.STRING
    },
    te_recordinghost: {
      type: DataTypes.STRING
    },
    te_recordinguser: {
      type: DataTypes.STRING
    },
    te_recordingpassword: {
      type: DataTypes.STRING
    },
    te_recordingdirectory: {
      type: DataTypes.STRING
    },
    te_defaultrrid: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'te_tenants',
    timestamps: false,
    hooks: {
      beforeCount(options) {
        options.raw = false;
      }
    }
  });


  // eslint-disable-next-line no-unused-vars
  tenants.associate = function (models) {
    tenants.hasMany(models.queues, {foreignKey: 'tenantId', sourceKey: 'id'});
    tenants.belongsToMany(models.users, {as: 'tenantAdmins', through: 'users_tenants', foreignKey: 'tenantId'});
  };

  return tenants;
};
