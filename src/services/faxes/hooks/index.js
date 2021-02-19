const {Forbidden} = require('@feathersjs/errors');
const AWS = require('aws-sdk');

exports.addIncomingFaxes = function () {
  return async context => {
    const sequelize = context.app.get('sequelizeClient');

    //we only want to do this if we are fetching USER SPECIFIC FAXES.
    if(context.params.query.hasOwnProperty('statusEmail')){
      const { statusEmail } = context.params.query;

      const incomingQuery = await sequelize.query(
        `
        SELECT
          fa_id AS id,
          fa_te_id AS tenantId,
          DATE_FORMAT(fa_date, '%Y-%m-%d %H:%i:%s') AS date,
          fa_direction AS direction,
          fa_dest_num AS destNum,
          fa_error AS error,
          fa_pages AS pages,
          fa_remoteid AS remoteId,
          fa_source_name AS sourceName,
          fa_source_num AS sourceNum,
          fa_status AS status,
          fa_statusemail AS statusEmail
        FROM
          di_dids
          INNER JOIN fa_faxes ON fa_faxes.fa_dest_num = di_dids.di_number AND fa_faxes.fa_direction = 'IN'
        WHERE
          di_dids.di_fax_email LIKE '%${statusEmail}%'
      `,
        {type: sequelize.QueryTypes.SELECT}
      );

      context.result = [
        ...context.result,
        ...incomingQuery
      ];
    }

    return context;
  };
};

exports.fetchFaxFile = function () {
  return async context => {

    const { id, tenantId, direction } = context.result;
    const { userRole, tenantIds } = context.params.user;

    //check tenantID and user to make sure this is allowed
    if(+userRole === 5 || +userRole === 7){
      const basicUserTenant = context.params.user.tenantId;
      if(basicUserTenant !== tenantId){
        throw new Forbidden('You Do Not Have Access To This Record!');
      }
    }

    if(+userRole === 3){
      if(!tenantIds.includes(tenantId)){
        throw new Forbidden('You Do Not Have Access To This Record!');
      }
    }

    //grab the tenant code
    const {tenantCode} = await context.app.service('tenants')._get(tenantId);

    //grab the S3 Bucket settings
    const settingsArray = {};
    const settingsS3 = await context.app.service('tenant-settings')._find({
      paginate: false,
      query: {
        code: {$in: ['FAXESDIR', 'FAXESPASSWORD', 'FAXESUSER', 'FAXESHOST']}
      }
    });
    for(let i = 0; i<settingsS3.length; i++){
      settingsArray[settingsS3[i].code] = settingsS3[i].value;
    }

    const {FAXESDIR, FAXESHOST, FAXESPASSWORD, FAXESUSER} = settingsArray;
    const s3 = new AWS.S3({
      region: FAXESHOST,
      accessKeyId: FAXESUSER,
      secretAccessKey: FAXESPASSWORD
    });

    let bucketKey, fileName;
    if(direction === 'IN'){
      bucketKey = `${tenantCode}/faxes/${id}.pdf`;
      fileName = `${id}.pdf`;
    } else{
      bucketKey = `${tenantCode}/faxes/${id}.tiff`;
      fileName = `${id}.tiff`;
    }

    const s3File = await s3.getObject({
      Bucket: FAXESDIR,
      Key: bucketKey,
    }).promise();

    context.result.file = {
      name: fileName,
      raw: s3File.Body
    };

    return context;
  };
};

exports.forceBasicUserParams = function (){
  return async context => {
    //we have access to the user making the request, so we can check the role id and customize the query accordingly.
    const { userRole, email } = context.params.user;

    if(+userRole === 5 || +userRole === 7){
      context.params.query = {
        statusEmail: email
      };
    }

    return context;
  };
};
