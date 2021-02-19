const groupBy = require('lodash/groupBy');

module.exports = async (type, app) => {

  //query the report table for the report type we are interested in.
  const reportsRes = await app.service('vox-reports').find({
    query: {
      type
    }
  });

  if(!reportsRes){
    return { msg: 'No Reports Need to Be Run!'};
  }

  let reports = [];
  for( let i = 0; i<reportsRes.length; i++){
    reports.push(reportsRes[i]);
  }
  reports = groupBy(reports,'tenantId');
  return reports;
};
