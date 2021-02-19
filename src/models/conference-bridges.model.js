// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const conferenceBridges = sequelizeClient.define('conference_bridges', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'cr_id',
      autoIncrement: true
    },
    tenantId: {
      type: DataTypes.INTEGER,
      field: 'cr_te_id'
    },
    number: {
      type: DataTypes.STRING,
      field: 'cr_number'
    },
    name: {
      type: DataTypes.STRING,
      field: 'cr_name'
    },
    hosted: {
      type: DataTypes.STRING,
      field: 'cr_hosted'
    },
    bookId: {
      type: DataTypes.INTEGER,
      field: 'cr_bookid'
    },
    rrid: {
      type: DataTypes.INTEGER,
      field: 'cr_rrid'
    },
    sendReport: {
      type: DataTypes.STRING,
      field: 'cr_sendreport'
    },
    sendReportEmail: {
      type: DataTypes.STRING,
      field: 'cr_sendreportemail'
    },
    sendReportMailFromDate: {
      type: DataTypes.DATE,
      field: 'cr_sendreportemailfromdate'
    },
    requestPinMeid: {
      type: DataTypes.INTEGER,
      field: 'cr_requestpinmeid'
    }
  }, {
    tableName: 'cr_conferencerooms',
    timestamps: false
  });

  // eslint-disable-next-line no-unused-vars
  conferenceBridges.associate = function (models) {
    conferenceBridges.belongsTo(models.tenants, {foreignKey: 'tenantId'});
  };

  return conferenceBridges;
};
