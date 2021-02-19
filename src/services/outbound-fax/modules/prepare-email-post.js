const { Forbidden, BadRequest } = require('@feathersjs/errors');
const fs = require('fs');

module.exports = async (params, app) => {

  //gather information about the files.
  let fileNames = '';
  let validFiles = [];
  let invalidFiles = [];
  for(let i = 0; i < params.files.length; i++){
    if(params.files[i].mimetype === 'application/pdf'){
      fileNames += params.files[i].path + ' ';
      validFiles.push(params.files[i].path);
    }else {
      invalidFiles.push(params.files[i].path);
    }
  }

  //remove files from tmp that cannot be faxed (not PDF)
  for(let i = 0; i < invalidFiles.length; i++){
    fs.unlink(invalidFiles[i], (err) => {});
  }

  //parse the from name and email stuff
  let statusEmail = '';
  try {
    const matchName = params.from.match('<');
    if(matchName){
      statusEmail = params.from.split('<')[1].replace('>', '');
    }else{
      statusEmail = params.from;
    }
  } catch (e){
    //we need to remove the files that multer uploaded
    console.log('we could not establish who this mail to fax was from');
    for(let i = 0; i < validFiles.length; i++){
      fs.unlink(validFiles[i], (err) => {});
    }
    throw new BadRequest('Could Not Establish Who This Fax Is From! (Email Post)');
  }

  const wildcard = `*@${statusEmail.split('@')[1]}`;

  //check mailtofaxes to see if this is allowed and populate additional params
  const mailToFaxes = app.service('mail-to-faxes');
  const faxUser = await mailToFaxes.find({
    query: {
      $or: [
        {email: statusEmail},
        {email: wildcard}
      ]
    }
  });

  if(!faxUser.length){
    //we need to remove the files that multer uploaded
    for(let i = 0; i < validFiles.length; i++){
      fs.unlink(validFiles[i], (err) => {});
    }
    throw new Forbidden('User Is Not Configured For Mail to Fax: ' + statusEmail);
  }
  const { tenantId, cidnum, name } = faxUser[0];

  //grab the tenant Code
  const {tenantCode} = await app.service('tenants').get(tenantId);

  let subjectParse;
  try {
    subjectParse = params.subject.match(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/g);
  } catch (e){
    console.log('there was no subject for the fax!');
    subjectParse = false;
  }

  if(!subjectParse){
    //remove the files so they aren't orphaned in the db.
    for(let i = 0; i < validFiles.length; i++){
      fs.unlink(validFiles[i], (err) => {});
    }
    throw new BadRequest('Destination number invalid or not provided!');
  }

  const subjectNumber = subjectParse[0].replace(/[^a-zA-Z0-9]+/g, '');

  return {
    tenantCode,
    tenantId,
    faxFromName: name,
    faxFrom: cidnum,
    faxTo: subjectNumber,
    coverMessage: params.text,
    statusEmail,
    files: fileNames
  };

};
