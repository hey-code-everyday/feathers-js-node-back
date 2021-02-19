// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const disas = sequelizeClient.define('disas', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'ds_id'
    },
    name: {
      type: DataTypes.STRING,
      field: 'ds_name'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'ds_te_id'
    }
  }, {
    tableName: 'ds_disas',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  disas.associate = function (models) {
    disas.belongsTo(models.tenants, {foreignKey: 'tenantId'});
    disas.hasMany(models.destinations, {as: 'de_destinations', foreignKey: 'de_type_id_src'});
  };

  return disas;
};
