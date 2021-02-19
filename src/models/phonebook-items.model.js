const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const phonebookItems = sequelizeClient.define('phonebook_items', {
    id: {
      type: DataTypes.INTEGER,
      field: 'pi_id',
      primaryKey: true,
      autoIncrement: true
    },
    itemCode: {
      type: DataTypes.STRING,
      field: 'pi_code'
    },
    itemName: {
      type: DataTypes.STRING,
      field: 'pi_name'
    }
  }, {
    tableName: 'pi_phonebookitems',
    timestamps: false
  });

  return phonebookItems;
};
