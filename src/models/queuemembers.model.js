// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const queuemembers = sequelizeClient.define('queuemembers', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'uniqueid'
    },
    membername: {
      type: DataTypes.STRING,
    },
    queueName: {
      type: DataTypes.INTEGER,
      field: 'queue_name'
    },
    interface: {
      type: DataTypes.STRING
    },
    stateInterface: {
      type: DataTypes.STRING,
      field: 'state_interface'
    },
    penalty: {
      type: DataTypes.INTEGER
    },
    paused: {
      type: DataTypes.INTEGER
    },
    memberdevice: {
      type: DataTypes.STRING,
      field: 'member_device'
    }
  }, {
    tableName: 'queue_member',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  queuemembers.associate = function (models) {
    queuemembers.belongsTo(models.queues, {foreignKey: 'queue_name'});
  };

  return queuemembers;
};
