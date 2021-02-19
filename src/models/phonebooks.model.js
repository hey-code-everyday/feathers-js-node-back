// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const phonebooks = sequelizeClient.define('phonebooks', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'pb_id',
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      field: 'pb_name'
    },
    includeExt: {
      type: DataTypes.STRING,
      field: 'pb_includeext'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'pb_te_id'
    }
  }, {
    tableName: 'pb_phonebooks',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  phonebooks.associate = function (models) {
    phonebooks.belongsTo(models.tenants, {foreignKey: 'tenantId'});
  };

  return phonebooks;
};
