// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const phonePhonebooks = sequelizeClient.define('phone_phonebooks', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'pp_id'
    },
    order: {
      type: DataTypes.INTEGER,
      field: 'pp_order'
    },
    phonebookId: {
      type: DataTypes.INTEGER,
      field: 'pp_pb_id'
    },
    deviceId: {
      type: DataTypes.INTEGER,
      field: 'pp_ph_id'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'pp_te_id'
    }
  }, {
    tableName: 'pp_phonephonebooks',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  phonePhonebooks.associate = function (models) {
    phonePhonebooks.belongsTo(models.devices, {foreignKey: 'pp_ph_id'});
    phonePhonebooks.belongsTo(models.phonebooks, {foreignKey: 'pp_pb_id'});
  };

  return phonePhonebooks;
};
