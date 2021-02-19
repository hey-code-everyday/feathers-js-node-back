const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const phonebookDetails = sequelizeClient.define('phonebook_details', {
    id: {
      type: DataTypes.INTEGER,
      field: 'pd_id',
      primaryKey: true,
      autoIncrement: true
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'pd_te_id'
    },
    phonebookEntryId: {
      type: DataTypes.INTEGER,
      field: 'pd_pe_id'
    },
    phonebookItemId: {
      type: DataTypes.INTEGER,
      field: 'pd_pi_id'
    },
    phonebookItemValue: {
      type: DataTypes.INTEGER,
      field: 'pd_pi_value'
    }
  }, {
    tableName: 'pd_phonebookdetails',
    timestamps: false
  });

  return phonebookDetails;
};
