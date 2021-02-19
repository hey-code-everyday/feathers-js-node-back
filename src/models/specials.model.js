// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const specials = sequelizeClient.define('specials', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'sp_id'
    },
    code: {
      type: DataTypes.STRING,
      field: 'sp_code'
    },
    name: {
      type: DataTypes.STRING,
      field: 'sp_name'
    }
  }, {
    tableName: 'sp_specials',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  specials.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return specials;
};
