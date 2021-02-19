const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const phonebookLayouts = sequelizeClient.define('phonebook_layouts', {
    id: {
      type: DataTypes.INTEGER,
      field: 'pl_id',
      primaryKey: true,
      autoIncrement: true
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'pl_te_id'
    },
    phonebookId: {
      type: DataTypes.INTEGER,
      field: 'pl_pb_id'
    },
    phonebookItemsId: {
      type: DataTypes.INTEGER,
      field: 'pl_pi_id'
    },
    order: {
      type: DataTypes.INTEGER,
      field: 'pl_order'
    }
  }, {
    tableName: 'pl_phonebooklayouts',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  phonebookLayouts.associate = function (models) {

  };

  return phonebookLayouts;
};
