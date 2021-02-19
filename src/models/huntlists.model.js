// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const huntlists = sequelizeClient.define('huntlists', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'hu_id'
    },
    number: {
      type: DataTypes.STRING,
      field: 'hu_number'
    },
    name: {
      type: DataTypes.STRING,
      field: 'hu_name'
    },
    type: {
      type: DataTypes.STRING,
      field: 'hu_type'
    },
    ringTime: {
      type: DataTypes.INTEGER,
      field: 'hu_ringtime'
    },
    allowFmFm: {
      type: DataTypes.STRING,
      field: 'hu_allowfmfm'
    },
    dialTimeout: {
      type: DataTypes.INTEGER,
      field: 'hu_dialtimeout'
    },
    fastDialing: {
      type: DataTypes.STRING,
      field: 'hu_fastdialing'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'hu_te_id'
    }
  }, {
    tableName: 'hu_huntlists',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  huntlists.associate = function (models) {
    huntlists.belongsTo(models.tenants, {foreignKey: 'tenantId'});
    huntlists.hasMany(models.destinations, {as: 'de_destinations', foreignKey: 'de_type_id_src'});
  };

  return huntlists;
};
