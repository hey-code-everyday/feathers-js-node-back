// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const conditions = sequelizeClient.define('conditions', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'co_id'
    },
    name: {
      type: DataTypes.STRING,
      field: 'co_name'
    },
    type: {
      type: DataTypes.STRING,
      field: 'co_type'
    },
    timeZone: {
      type: DataTypes.STRING,
      field: 'co_timezone'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'co_te_id'
    }
  }, {
    tableName: 'co_conditions',
    timestamps: false
  });

  conditions.associate = function (models) {
    conditions.belongsTo(models.tenants, {foreignKey: 'tenantId'});
    conditions.hasMany(models.destinations, {as: 'de_destinations', foreignKey: 'de_type_id_src'});
    conditions.hasMany(models.conditions_extended, {as: 'condition_params', foreignKey: 'ce_co_id'});
  };

  return conditions;
};
