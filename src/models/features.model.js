// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const features = sequelizeClient.define('features', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'fe_id'
    },
    code: {
      type: DataTypes.STRING,
      field: 'fe_code'
    },
    comment: {
      type: DataTypes.STRING,
      field: 'fe_comment'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'fe_te_id'
    }
  }, {
    tableName: 'fe_features',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  features.associate = function (models) {
    features.belongsTo(models.tenants, {foreignKey: 'tenantId'});
    features.hasMany(models.destinations, {as: 'de_destinations', foreignKey: 'de_type_id_src'});
  };

  return features;
};
