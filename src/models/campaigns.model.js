// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const campaigns = sequelizeClient.define('campaigns', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'ca_id'
    },
    name: {
      type: DataTypes.STRING,
      field: 'ca_name'
    },
    type: {
      type: DataTypes.STRING,
      field: 'ca_type'
    },
    dateStart: {
      type: DataTypes.DATEONLY,
      field: 'ca_datestart'
    },
    dateEnd: {
      type: DataTypes.DATEONLY,
      field: 'ca_dateend'
    },
    maxChannels: {
      type: DataTypes.INTEGER,
      field: 'ca_maxchannels'
    },
    maxAttempts: {
      type: DataTypes.INTEGER,
      field: 'ca_maxattempts'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'ca_te_id'
    }
  }, {
    tableName: 'ca_campaigns',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  campaigns.associate = function (models) {
    campaigns.belongsTo(models.tenants, {foreignKey: 'tenantId'});
    campaigns.hasMany(models.destinations, {as:'de_destinations', foreignKey: 'de_type_id_src'});
  };

  return campaigns;
};
