// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const callgroups = sequelizeClient.define(
    'callgroups',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'cg_id',
        autoIncrement: true,
      },
      tenantId: {
        type: DataTypes.INTEGER,
        field: 'cg_te_id',
      },
      extensionId: {
        type: DataTypes.INTEGER,
        field: 'cg_ex_id',
      },
      value: {
        type: DataTypes.STRING,
        field: 'cg_value',
      },
    },
    {
      tableName: 'cg_callgroups',
      timestamps: false,
      hooks: {
        beforeCount(options) {
          options.raw = true;
        },
      },
    }
  );

  // eslint-disable-next-line no-unused-vars
  callgroups.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return callgroups;
};
