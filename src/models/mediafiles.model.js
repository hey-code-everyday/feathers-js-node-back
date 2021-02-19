// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const mediafiles = sequelizeClient.define(
    'mediafiles',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'me_id',
      },
      tenantId: {
        type: DataTypes.INTEGER,
        field: 'me_te_id',
      },
      name: {
        type: DataTypes.STRING,
        field: 'me_name',
      },
    },
    {
      tableName: 'me_mediafiles',
      timestamps: false,
    }
  );

  // eslint-disable-next-line no-unused-vars
  mediafiles.associate = function (models) {
    mediafiles.belongsTo(models.tenants, { foreignKey: 'me_te_id' });
  };

  return mediafiles;
};
