module.exports = async (app) => {

  const settingsService = app.service('tenant-settings');
  const settings = await settingsService.find({
    query: {
      code: {$in: ['IQNTWEBHOOKSKEY','IQNTTRUNKGROUP', 'IQNTCLIENTSECRET', 'IQNTCLIENTID', 'IQNTAUTHURL', 'IQNTBASEURL']}
    }
  });
  const iqParams = {};
  for(let i = 0; i<settings.length; i++){
    iqParams[settings[i].code] = settings[i].value;
  }
  return iqParams;
};
