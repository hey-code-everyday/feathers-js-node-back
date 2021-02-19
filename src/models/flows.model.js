// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const flows = sequelizeClient.define('flows', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'fl_id'
    },
    name: {
      type: DataTypes.STRING,
      field: 'fl_name'
    },
    number: {
      type: DataTypes.STRING,
      field: 'fl_number'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'fl_te_id'
    }
  }, {
    tableName: 'fl_flows',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  flows.associate = function (models) {
    flows.belongsTo(models.tenants, {foreignKey: 'tenantId'});
    flows.hasMany(models.destinations, {as: 'de_destinations', foreignKey: 'de_type_id_src'});
  };

  return flows;
};
