// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const conditionsExtended = sequelizeClient.define('conditions_extended', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'ce_id'
    },
    param1: {
      type: DataTypes.INTEGER,
      field: 'ce_param1'
    },
    param2: {
      type: DataTypes.STRING,
      field: 'ce_param2'
    },
    param3: {
      type: DataTypes.STRING,
      field: 'ce_param3'
    }
  }, {
    tableName: 'ce_conditions_extended',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  conditionsExtended.associate = function (models) {
    conditionsExtended.belongsTo(models.conditions, {foreignKey: 'ce_co_id'});
    conditionsExtended.belongsTo(models.tenants, {foreignKey: 'ce_te_id'});
  };

  return conditionsExtended;
};
