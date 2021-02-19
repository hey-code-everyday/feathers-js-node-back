// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const asteriskNodes = sequelizeClient.define('asterisk_nodes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'no_id'
    },
    name: {
      type: DataTypes.STRING,
      field: 'no_name'
    },
    ip: {
      type: DataTypes.STRING,
      field: 'no_ipaddress'
    },
    managerUser: {
      type: DataTypes.STRING,
      field: 'no_manageruser'
    },
    managerPassword: {
      type: DataTypes.STRING,
      field: 'no_managerpassword'
    },
    devStatePong: {
      type: DataTypes.STRING,
      field: 'no_devstate_pong'
    },
    devStateVersion: {
      type: DataTypes.STRING,
      field: 'no_devstateversion'
    },
    mirtaPbxVersion: {
      type: DataTypes.STRING,
      field: 'no_mirtapbxversion'
    }
  }, {
    tableName: 'no_nodes',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  asteriskNodes.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return asteriskNodes;
};
