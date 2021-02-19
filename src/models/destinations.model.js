// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const destinations = sequelizeClient.define('destinations', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'de_id'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'de_te_id'
    },
    typeSrc: {
      type: DataTypes.STRING,
      field: 'de_type_src'
    },
    typeIdSrc: {
      type: DataTypes.INTEGER,
      field: 'de_type_id_src'
    },
    typeDst: {
      type: DataTypes.STRING,
      field: 'de_type_dst'
    },
    typeIdDst: {
      type: DataTypes.INTEGER,
      field: 'de_type_id_dst'
    },
    order: {
      type: DataTypes.INTEGER,
      field: 'de_ord'
    }
  }, {
    tableName: 'de_destinations',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  destinations.associate = function (models) {
    destinations.belongsTo(models.tenants, {foreignKey: 'tenantId'});
    destinations.belongsTo(models.conditions, {foreignKey: 'typeIdDst'});
    destinations.belongsTo(models.extensions, {foreignKey: 'typeIdDst'});
    destinations.belongsTo(models.huntlists, {foreignKey: 'typeIdDst'});
    destinations.belongsTo(models.ivrs, {foreignKey: 'typeIdDst'});
    destinations.belongsTo(models.conference_bridges, {foreignKey: 'typeIdDst'});
    destinations.belongsTo(models.queues, {foreignKey: 'typeIdDst'});
    destinations.belongsTo(models.voicemails, {foreignKey: 'typeIdDst'});
  };

  return destinations;
};
