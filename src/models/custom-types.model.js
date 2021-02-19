// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const customTypes = sequelizeClient.define('custom_types', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'ct_id'
    },
    name: {
      type: DataTypes.STRING,
      field: 'ct_name'
    }
  }, {
    tableName: 'ct_customtypes',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  customTypes.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return customTypes;
};
