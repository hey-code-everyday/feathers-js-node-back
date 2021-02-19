// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const faxes = sequelizeClient.define('faxes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'fa_id',
      autoIncrement: true
    },
    sourceNum: {
      type: DataTypes.STRING,
      field: 'fa_source_num'
    },
    sourceName: {
      type: DataTypes.STRING,
      field: 'fa_source_name'
    },
    destNum: {
      type: DataTypes.STRING,
      field: 'fa_dest_num'
    },
    remoteId: {
      type: DataTypes.STRING,
      field: 'fa_remoteid'
    },
    direction: {
      type: DataTypes.STRING,
      field: 'fa_direction'
    },
    date: {
      type: DataTypes.STRING,
      field: 'fa_date'
    },
    pages: {
      type: DataTypes.INTEGER,
      field: 'fa_pages'
    },
    status: {
      type: DataTypes.STRING,
      field: 'fa_status'
    },
    statusEmail: {
      type: DataTypes.STRING,
      field: 'fa_statusemail'
    },
    error: {
      type: DataTypes.STRING,
      field: 'fa_error'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'fa_te_id'
    },
    file: {
      type: DataTypes.BLOB,
      field: 'fa_file'
    }
  }, {
    tableName: 'fa_faxes',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  faxes.associate = function (models) {
    faxes.belongsTo(models.tenants, {foreignKey: 'tenantId'});
  };

  return faxes;
};
