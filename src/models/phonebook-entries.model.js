const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const phonebookEntries = sequelizeClient.define('phonebook_entries', {
    id: {
      type: DataTypes.INTEGER,
      field: 'pe_id',
      primaryKey: true,
      autoIncrement: true
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'pe_te_id'
    },
    phonebookId: {
      type: DataTypes.INTEGER,
      field: 'pe_pb_id'
    }
  }, {
    tableName: 'pe_phonebookentries',
    timestamps: false
  });

  return phonebookEntries;
};
