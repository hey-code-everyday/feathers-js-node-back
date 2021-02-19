const {Base64} = require('js-base64');
const CONSTANTS = require('../../../ref/constants');

exports.addAutoprovisionLabels = function () {
  return async context => {

    const {mac} = context.result;
    const labelsService = context.app.service('autoprovision-labels');
    const ignoreArray = CONSTANTS.DEVICE_IGNORE_VARIABLES;
    const macDecoded = Base64.encode(mac);
    const macVarArray = Base64.atob(macDecoded).match(/(?<=\{\$).+?(?=\}|\|)/g);

    let filteredArray = macVarArray ? macVarArray.filter( item => !ignoreArray.includes(item)) : [];

    const Labels = await labelsService.find({query: {value: {$in: filteredArray}}});
    context.result.labels = Labels ? Labels : [];

    return context;
  };
};
