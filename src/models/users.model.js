// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const users = sequelizeClient.define('users', {
    id: {
      type: DataTypes.INTEGER,
      field: 'us_id',
      primaryKey: true,
      autoIncrement: true
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'us_te_id'
    },
    receiveQueueReports: {
      type: DataTypes.TINYINT,
      field: 'us_receive_queue_reports'
    },
    email: {
      type: DataTypes.STRING,
      field: 'us_username',
      allowNull: false,
      unique: true
    },
    emailField: {
      type: DataTypes.STRING,
      field: 'us_email'
    },
    password: {
      type: DataTypes.STRING,
      field: 'us_password',
      allowNull: false
    },
    avatarPath: {
      type: DataTypes.STRING,
      field: 'us_avatar_path'
    },
    avatarFileName: {
      type: DataTypes.STRING,
      field: 'us_avatar_file_name'
    },
    userRole: {
      type: DataTypes.STRING,
      field: 'us_up_id'
    },
    us_useldap: {
      type: DataTypes.STRING
    },
    resetToken: {
      type: DataTypes.STRING,
      field: 'us_resettoken'
    },
    enableCallNotifications: {
      type: DataTypes.TINYINT,
      field: 'us_enable_call_notifications'
    },
    enableChatNotifications: {
      type: DataTypes.TINYINT,
      field: 'us_enable_chat_notifications'
    }
  }, {
    tableName: 'us_users',
    timestamps: false,
    hooks: {
      beforeCount(options) {
        options.raw = false;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  users.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return users;
};
