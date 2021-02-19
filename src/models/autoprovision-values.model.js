// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const autoprovisionValues = sequelizeClient.define('autoprovision_values', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'av_id'
    },
    type: {
      type: DataTypes.STRING,
      field: 'av_type'
    },
    order: {
      type: DataTypes.STRING,
      field: 'av_order'
    },
    alId: {
      type: DataTypes.INTEGER,
      field: 'av_al_id'
    },
    avValue: {
      type: DataTypes.STRING,
      field: 'av_value'
    }
  }, {
    tableName: 'av_autoprovisionvalues',
    timestamps: false
  });

  autoprovisionValues.associate = function (models) {
    autoprovisionValues.belongsTo(models.tenants, {foreignKey: 'av_te_id'});
    autoprovisionValues.belongsTo(models.devices, {foreignKey: 'av_ph_id'});
    autoprovisionValues.belongsTo(models.autoprovision_labels, {foreignKey: 'av_al_id'});
  };

  return autoprovisionValues;
};
