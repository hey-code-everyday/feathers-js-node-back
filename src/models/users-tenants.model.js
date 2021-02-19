// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const usersTenants = sequelizeClient.define('users_tenants', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'ut_id',
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'ut_us_id'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'ut_te_id'
    }
  }, {
    tableName: 'ut_usertenants',
    timestamps: false,
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  usersTenants.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return usersTenants;
};
