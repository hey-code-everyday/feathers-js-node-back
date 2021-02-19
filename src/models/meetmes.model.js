// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const meetmes = sequelizeClient.define('meetmes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'bookid'
    },
    confno: {
      type: DataTypes.STRING
    },
    starttime: {
      type: DataTypes.STRING
    },
    endtime: {
      type: DataTypes.STRING
    },
    pin: {
      type: DataTypes.STRING
    },
    adminpin: {
      type: DataTypes.STRING
    },
    opts: {
      type: DataTypes.STRING
    },
    maxusers: {
      type: DataTypes.INTEGER
    },
    members: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'meetme',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  meetmes.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return meetmes;
};
