// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const callBlocking = sequelizeClient.define('call_blocking', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'bl_id',
      autoIncrement: true
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'bl_te_id'
    },
    callerId: {
      type: DataTypes.STRING,
      field: 'bl_callerid'
    },
    inserted: {
      type: DataTypes.DATE,
      field: 'bl_inserted'
    },
    reason: {
      type: DataTypes.STRING,
      field: 'bl_reason'
    }
  }, {
    tableName: 'bl_blacklists',
    timestamps: false
  });


  callBlocking.associate = function (models) {
    callBlocking.belongsTo(models.tenants, {foreignKey: 'tenantId'});
  };

  return callBlocking;
};
