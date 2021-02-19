const { Op } = require('sequelize');

module.exports = async(ids, app) => {

  const sequelize = app.get('sequelizeClient');
  const TenantModel = sequelize.models.tenants;
  const QueueModel = sequelize.models.queues;

  const tenantsRes = await TenantModel.findAll({
    where: {
      id: {[Op.in]: ids}
    },
    include: [
      {
        model: QueueModel,
      }
    ]
  }).then ( res => {
    return res;
  });

  let tenants = [];
  for(let i = 0; i<tenantsRes.length; i++){
    let tenant = {
      id: tenantsRes[i].dataValues.id,
      name: tenantsRes[i].dataValues.name,
      tenantCode: tenantsRes[i].dataValues.tenantCode,
      queues: []
    };
    for(let k = 0; k<tenantsRes[i].dataValues.queues.length; k++){
      tenant.queues.push({
        id: tenantsRes[i].dataValues.queues[k].dataValues.id,
        name: tenantsRes[i].dataValues.queues[k].dataValues.name
      });
    }
    tenants.push(tenant);
  }

  return tenants;
};
