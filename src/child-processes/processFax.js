const AWS = require('aws-sdk');
const fs = require('fs');
const moment = require('moment');
const {db} = require('./db');
const { execSync } = require('child_process');
const natsConfig = require('../nats/config');
const NATS = require('nats');
const buildCoverPage = require('../services/outbound-fax/modules/build-cover-page');

let params = {};
for(let i = 0; i < process.argv.length; i++){
  const keyValueArray = process.argv[i].split(':');
  params[keyValueArray[0]] = keyValueArray[1];
}

//console.log(params);
// console.log(params.files);

const processFax = async(params) => {
  const { files, tenantCode, tenantId, faxTo, faxFrom, faxFromName, statusEmail } = params;
  // const saveDirectory = '/Users/drbologna/Desktop/faxTmp';
  const saveDirectory = '/tmp';
  // const psFixedA4 = '/Users/drbologna/Desktop/faxTmp/fixeda4.ps';
  const psFixedA4 = '/opt/omnia-api/src/child-processes/fixeda4.ps';

  let fileNameArray = files.split(' ');
  //combine all the files into a single pdf, convert to tiff, count pages
  let combineFileList = '';
  let pagesCombined = 0;
  let combinedOutputFileName = '';
  if(fileNameArray.length){
    combineFileList = fileNameArray.join(' ');
    combinedOutputFileName = `${saveDirectory}/${moment().unix()}_combined_files.pdf`;
    execSync(`gs -dBATCH -dNOPAUSE -sDEVICE=pdfwrite -dAutoRotatePages=/None -sOutputFile=${combinedOutputFileName} ${psFixedA4} ${combineFileList}`);
    execSync(`gs -o ${combinedOutputFileName}.tiff -sDEVICE=tiffg4 -r204x98 -dBATCH -dPDFFitPage -dNOPAUSE ${combinedOutputFileName}`);
    pagesCombined = execSync(`tiffinfo ${combinedOutputFileName}.tiff | grep 'Page Number' | wc -l`);
    fileNameArray.push(combinedOutputFileName);
    fileNameArray.push(`${combinedOutputFileName}.tiff`);
  }

  //create the cover page, cat grease.
  const coverPageName = moment().unix() + '_cover_page.pdf';
  params.pages = +pagesCombined + 1;
  params.outputDirectory = `${saveDirectory}/${coverPageName}`;
  await buildCoverPage(params);
  fileNameArray.push(params.outputDirectory);

  //combine files
  const finalOutputName = `${saveDirectory}/${moment().unix()}_final_fax.pdf`;
  execSync(`gs -dBATCH -dNOPAUSE -sDEVICE=pdfwrite -dAutoRotatePages=/None -sOutputFile=${finalOutputName} ${psFixedA4} ${params.outputDirectory} ${combinedOutputFileName}`);
  fileNameArray.push(finalOutputName);

  //convert final to tiff
  execSync(`gs -o ${finalOutputName}.tiff -sDEVICE=tiffg4 -r204x98 -sPAPERSIZE=letter  -dBATCH -dNOPAUSE ${finalOutputName}`);
  fileNameArray.push(`${finalOutputName}.tiff`);

  //insert into fa_faxes
  const sqlDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
  const faId = await db.query(`INSERT INTO fa_faxes(fa_te_id,fa_source_num,fa_source_name,fa_dest_num,fa_direction,fa_remoteid,fa_file,fa_date,fa_pages,fa_status,fa_statusemail) values ('${tenantId}','${faxFrom}','${faxFromName}','${faxTo}','OUT','','','${sqlDateTime}','${params.pages}','READY','${statusEmail}')`);
  const faxId = faId[0].insertId;

  //upload to S3
  const [faxRows] = await db.query(`SELECT (SELECT se_value from se_settings where se_te_id=-1 and se_code = 'FAXESHOST') AS faxHost, (SELECT se_value from se_settings where se_te_id=-1 and se_code = 'FAXESUSER') AS faxUser, (SELECT se_value from se_settings where se_te_id=-1 and se_code = 'FAXESPASSWORD') AS faxPass, (SELECT se_value from se_settings where se_te_id=-1 and se_code = 'FAXESDIR') AS faxDir`);
  const faxDir = faxRows[0].faxDir;
  const faxHost = faxRows[0].faxHost;
  const faxUser = faxRows[0].faxUser;
  const faxPass = faxRows[0].faxPass;
  const fileStream = fs.readFileSync(`${finalOutputName}.tiff`);
  const s3 = new AWS.S3({region: faxHost, accessKeyId: faxUser, secretAccessKey: faxPass});
  const s3params = {Bucket: faxDir, Key: `${tenantCode}/faxes/${faxId}.tiff`, Body: fileStream};
  await s3.putObject(s3params).promise();

  //send request to API to emit realtime event
  //fire real time event for OMNIA Front End
  //we will have to query the fax record and map to our event structure
  const [faxRecord] = await db.query(`SELECT *,DATE_FORMAT(fa_date, '%Y-%m-%d %h:%i:%s') AS dateString FROM fa_faxes WHERE fa_id='${faxId}'`);
  const recordMap = {
    id: faxRecord[0].fa_id,
    date: faxRecord[0].dateString,
    direction: faxRecord[0].fa_direction,
    destNum: faxRecord[0].fa_dest_num,
    pages: faxRecord[0].fa_pages,
    remoteId: faxRecord[0].fa_remoteid,
    error: faxRecord[0].fa_error,
    sourceName: faxRecord[0].fa_source_name,
    sourceNum: faxRecord[0].fa_source_num,
    status: faxRecord[0].fa_status,
    statusEmail: faxRecord[0].fa_statusemail,
    tenantId: faxRecord[0].fa_te_id
  };

  const socketData = {
    roomType: 'faxes',
    email: statusEmail,
    ...recordMap
  };

  const natsMessage = {
    event: 'newFax',
    path: 'channel-memberships',
    data: socketData
  };

  const {natsOptions} = natsConfig;
  const natsClient = NATS.connect(natsOptions);
  natsClient.publish('feathers-sync', JSON.stringify(natsMessage));
  natsClient.close();

  //clean up the directory
  for(let i = 0; i < fileNameArray.length; i++){
    fs.unlink(fileNameArray[i], (err) => {});
  }

};

processFax(params).then( () => {
  process.exit();
});
