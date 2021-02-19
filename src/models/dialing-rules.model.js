// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const dialingRules = sequelizeClient.define('dialing_rules', {
    id: {
      type: DataTypes.INTEGER,
      field: 'dl_id',
      primaryKey: true,
      autoIncrement: true
    },
    routingProfileId: {
      type: DataTypes.INTEGER,
      field: 'dl_rp_id'
    },
    name: {
      type: DataTypes.STRING,
      field: 'dl_name'
    },
    regex: {
      type: DataTypes.STRING,
      field: 'dl_regex'
    },
    providerId: {
      type: DataTypes.INTEGER,
      field: 'dl_pr_id'
    },
    addDigits: {
      type: DataTypes.STRING,
      field: 'dl_adddigits'
    },
    delDigits: {
      type: DataTypes.STRING,
      field: 'dl_deldigits'
    },
    priority: {
      type: DataTypes.STRING,
      field: 'dl_priority'
    },
    order: {
      type: DataTypes.INTEGER,
      field: 'dl_order'
    },
    weight: {
      type: DataTypes.STRING,
      field: 'dl_weight'
    },
    emergencyRoute: {
      type: DataTypes.STRING,
      field: 'dl_emergencyroute'
    }
  }, {
    tableName: 'dl_dialingrules',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  dialingRules.associate = function (models) {
    dialingRules.belongsTo(models.providers, {foreignKey: 'providerId'});
  };

  return dialingRules;
};
