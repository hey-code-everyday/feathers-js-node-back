/*eslint-disable */

module.exports = async (params, app) => {

  const sequelize = app.get('sequelizeClient');
  const memberDevice = "'%-"+params.tenantCode+"'";

  let agents = await sequelize.query(
    "SELECT DISTINCT\n" +
    "    membername,\n" +
    "    member_device,\n" +
    "    queue_name\n" +
    "FROM\n" +
    "    queue_member\n" +
    "WHERE\n" +
    "    member_device LIKE "+ memberDevice +"\n" +
    "UNION SELECT DISTINCT\n"+
    "    aq_membername,\n" +
    "    aq_member_device,\n"+
    "    aq_queue_name\n"+
    "FROM\n"+
    "    aq_allowed_queue_member\n" +
    "WHERE\n"+
    "    aq_member_device LIKE "+ memberDevice +"\n;",
    { type: sequelize.QueryTypes.SELECT}
  ).then( res => res);

  let extenArray = [];
  for(let i = 0; i<agents.length; i++){
    const device = agents[i].member_device;
    extenArray.push(device.split('-')[0]);
  }

  return extenArray;
};
