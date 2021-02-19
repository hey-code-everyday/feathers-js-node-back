// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const musiconholds = sequelizeClient.define('musiconholds', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'mu_id'
    },
    name: {
      type: DataTypes.STRING,
      field: 'mu_name'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'mu_te_id'
    }
  }, {
    tableName: 'mu_musiconholds',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  musiconholds.associate = function (models) {
    musiconholds.belongsTo(models.tenants, {foreignKey: 'tenantId'});
    musiconholds.hasMany(models.destinations, {as: 'de_destinations', foreignKey: 'de_type_id_src'});
  };

  return musiconholds;
};
