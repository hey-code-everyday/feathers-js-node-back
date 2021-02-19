// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const customs = sequelizeClient.define(
    'customs',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'cu_id',
      },
      name: {
        type: DataTypes.STRING,
        field: 'cu_name',
      },
      param1: {
        type: DataTypes.STRING,
        field: 'cu_param1',
      },
      param2: {
        type: DataTypes.STRING,
        field: 'cu_param2',
      },
      param3: {
        type: DataTypes.STRING,
        field: 'cu_param3',
      },
      param4: {
        type: DataTypes.STRING,
        field: 'cu_param4',
      },
      param5: {
        type: DataTypes.STRING,
        field: 'cu_param5',
      },
      param6: {
        type: DataTypes.STRING,
        field: 'cu_param6',
      },
      param7: {
        type: DataTypes.STRING,
        field: 'cu_param7',
      },
      param8: {
        type: DataTypes.STRING,
        field: 'cu_param8',
      },
      param9: {
        type: DataTypes.STRING,
        field: 'cu_param9',
      },
      param10: {
        type: DataTypes.STRING,
        field: 'cu_param10',
      },
      tenantId: {
        type: DataTypes.INTEGER,
        field: 'cu_te_id',
      },
    },
    {
      tableName: 'cu_customs',
      timestamps: false,
    }
  );

  // eslint-disable-next-line no-unused-vars
  customs.associate = function (models) {
    customs.belongsTo(models.custom_types, { foreignKey: 'cu_ct_id' });
    customs.belongsTo(models.tenants, { foreignKey: 'tenantId' });
  };

  return customs;
};
