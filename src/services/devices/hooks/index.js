const axios = require('axios');
const { db } = require('../../../child-processes/db');

exports.afterCreateDevice = () => async (context) => {
  // Add phone to Yealink RPS if MAC begins with 805EC0, 805E0C, 001565
  let mac = context.result.mac;
  const pmId = context.result.phPmId;
  mac = mac.replace(/:/g, '');

  if (mac.includes('805EC0') || mac.includes('805E0C') || mac.includes('001565')) {

    const xml = `<?xml version='1.0' encoding='UTF-8'?><methodCall><methodName>redirect.registerDevice</methodName><params><param><value><string><![CDATA[${mac}]]></string></value></param><param><value><string><![CDATA[VOXO]]></string></value></param><param><value><string><![CDATA[1]]></string></value></param></params></methodCall>`;
    const [rpsCreds] = await db.query(
      `select pm_remoteposturl, pm_remotepostuser, pm_remotepostpassword from pm_phonemodels where pm_id = ${pmId}`
    );
    const xmlParams = {
      auth: {
        username: rpsCreds[0].pm_remotepostuser,
        password: rpsCreds[0].pm_remotepostpassword,
      },
      headers: { 'Content-Type': 'text/xml' },
      withCredentials: true
    };
    axios.post(`${rpsCreds[0].pm_remoteposturl}`, xml, xmlParams);
  }
};
