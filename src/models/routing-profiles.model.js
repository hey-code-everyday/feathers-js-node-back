// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const routingProfiles = sequelizeClient.define('routing_profiles', {
    id: {
      type: DataTypes.INTEGER,
      field: 'rp_id',
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      field: 'rp_name'
    },
    description: {
      type: DataTypes.STRING,
      field: 'rp_description'
    },
    type: {
      type: DataTypes.STRING,
      field: 'rp_type'
    }
  }, {
    tableName: 'rp_routingprofiles',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  routingProfiles.associate = function (models) {
    routingProfiles.hasMany(models.dialing_rules, {foreignKey: 'routingProfileId'})
  };

  return routingProfiles;
};
