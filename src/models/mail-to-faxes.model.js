// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const mailToFaxes = sequelizeClient.define('mailtofaxes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'mf_id'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'mf_te_id'
    },
    name: {
      type: DataTypes.STRING,
      field: 'mf_name'
    },
    email: {
      type: DataTypes.STRING,
      field: 'mf_email'
    },
    cidnum: {
      type: DataTypes.STRING,
      field: 'mf_cidnum'
    }
  }, {
    tableName: 'mf_mailtofaxes',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars

  return mailToFaxes;
};
