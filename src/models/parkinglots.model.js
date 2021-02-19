// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const parkinglots = sequelizeClient.define('parkinglots', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'pk_id'
    },
    name: {
      type: DataTypes.STRING,
      field: 'pk_name'
    },
    start: {
      type: DataTypes.INTEGER,
      field: 'pk_start'
    },
    end: {
      type: DataTypes.INTEGER,
      field: 'pk_end'
    },
    hosted: {
      type: DataTypes.STRING,
      field: 'pk_hosted'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'pk_te_id'
    }
  }, {
    tableName: 'pk_parkinglots',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  parkinglots.associate = function (models) {
    parkinglots.belongsTo(models.tenants, {foreignKey: 'tenantId'})
  };

  return parkinglots;
};
