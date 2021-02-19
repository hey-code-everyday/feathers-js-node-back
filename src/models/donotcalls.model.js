// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const donotcalls = sequelizeClient.define(
    'donotcalls',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'dc_id',
        autoIncrement: true,
      },
      tenantId: {
        type: DataTypes.INTEGER,
        field: 'dc_te_id',
      },
      name: {
        type: DataTypes.STRING,
        field: 'dc_name',
      },
      description: {
        type: DataTypes.STRING,
        field: 'dc_description',
      },
    },
    {
      tableName: 'dc_donotcalls',
      timestamps: false,
      hooks: {
        beforeCount(options) {
          options.raw = true;
        },
      },
    }
  );

  // eslint-disable-next-line no-unused-vars
  donotcalls.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return donotcalls;
};
