// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const pagingGroups = sequelizeClient.define('paging_groups', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'pa_id'
    },
    number: {
      type: DataTypes.STRING,
      field: 'pa_number'
    },
    name: {
      type: DataTypes.STRING,
      field: 'pa_name'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'pa_te_id'
    }
  }, {
    tableName: 'pa_paginggroups',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  pagingGroups.associate = function (models) {
    pagingGroups.belongsTo(models.tenants, {foreignKey: 'tenantId'});
    pagingGroups.hasMany(models.destinations, {as: 'de_destinations', foreignKey: 'de_type_id_src'});
  };

  return pagingGroups;
};
