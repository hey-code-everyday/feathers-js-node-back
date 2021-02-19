// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const pickupgroups = sequelizeClient.define(
    'pickupgroups',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'pg_id',
        autoIncrement: true,
      },
      tenantId: {
        type: DataTypes.INTEGER,
        field: 'pg_te_id',
      },
      extensionId: {
        type: DataTypes.INTEGER,
        field: 'pg_ex_id',
      },
      value: {
        type: DataTypes.STRING,
        field: 'pg_value',
      },
    },
    {
      tableName: 'pg_pickupgroups',
      timestamps: false,
      hooks: {
        beforeCount(options) {
          options.raw = true;
        },
      },
    }
  );

  // eslint-disable-next-line no-unused-vars
  pickupgroups.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return pickupgroups;
};
