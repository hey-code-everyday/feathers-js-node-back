// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const providers = sequelizeClient.define('providers', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'pr_id'
    },
    name: {
      type: DataTypes.STRING,
      field: 'pr_name'
    },
    peerName: {
      type: DataTypes.STRING,
      field: 'pr_peername'
    },
    caId: {
      type: DataTypes.INTEGER,
      field: 'pr_ca_id'
    },
    tech: {
      type: DataTypes.STRING,
      field: 'pr_tech'
    },
    techId: {
      type: DataTypes.INTEGER,
      field: 'pr_tech_id'
    },
    useRealtime: {
      type: DataTypes.STRING,
      field: 'pr_userealtime'
    },
    callerPres: {
      type: DataTypes.STRING,
      field: 'pr_callerpres'
    },
    inboundDelDigits: {
      type: DataTypes.STRING,
      field: 'pr_inbounddeldigits'
    },
    penalty: {
      type: DataTypes.STRING,
      field: 'pr_penalty'
    }
  }, {
    tableName: 'pr_providers',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  providers.associate = function (models) {
    providers.belongsTo(models.sipfriends, {foreignKey: 'techId'});
  };

  return providers;
};
