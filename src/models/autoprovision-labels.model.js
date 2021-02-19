// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const autoprovisionLabels = sequelizeClient.define('autoprovision_labels', {
    id: {
      type: DataTypes.INTEGER,
      field: 'al_id',
      primaryKey: true
    },
    label: {
      type: DataTypes.STRING,
      field: 'al_label'
    },
    value: {
      type: DataTypes.STRING,
      field: 'al_value'
    },
    type: {
      type: DataTypes.STRING,
      field: 'al_type'
    },
    order: {
      type: DataTypes.STRING,
      field: 'al_order'
    }
  }, {
    tableName: 'al_autoprovisionlabels',
    timestamps: false
  });


  autoprovisionLabels.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return autoprovisionLabels;
};
