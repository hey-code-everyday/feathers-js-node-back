// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const ivrs = sequelizeClient.define(
    'ivrs',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'iv_id',
      },
      name: {
        type: DataTypes.STRING,
        field: 'iv_name',
      },
      meId: {
        type: DataTypes.INTEGER,
        field: 'iv_me_id',
      },
      timeout: {
        type: DataTypes.INTEGER,
        field: 'iv_timeout',
      },
      loopOnTimeout: {
        type: DataTypes.STRING,
        field: 'iv_loopontimeout',
      },
      loopOnWrongKeyPress: {
        type: DataTypes.STRING,
        field: 'iv_looponwrongkeypress',
      },
      allowDisa: {
        type: DataTypes.STRING,
        field: 'iv_allowdisa',
      },
      allowFeatures: {
        type: DataTypes.STRING,
        field: 'iv_allowfeatures',
      },
      digitTimeout: {
        type: DataTypes.STRING,
        field: 'iv_digittimeout',
      },
      allowCustom: {
        type: DataTypes.STRING,
        field: 'iv_allowcustom',
      },
      maxLoops: {
        type: DataTypes.INTEGER,
        field: 'iv_maxloops',
      },
      tenantId: {
        type: DataTypes.INTEGER,
        field: 'iv_te_id',
      },
    },
    {
      tableName: 'iv_ivrs',
      timestamps: false,
    }
  );

  // eslint-disable-next-line no-unused-vars
  ivrs.associate = function (models) {
    ivrs.belongsTo(models.tenants, { foreignKey: 'tenantId' });
    ivrs.hasMany(models.destinations, {
      as: 'de_destinations',
      foreignKey: 'de_type_id_src',
    });
  };

  return ivrs;
};
