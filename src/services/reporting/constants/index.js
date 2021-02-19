//this is a quick file that references tenant ids and their hunt list reporting groups

const receiveAll = ['luke.tauscher@ntgfreight.com', 'julie.kim@ntgfreight.com', 'david.watson@ntgfreight.com'];
const NOC = ['isaiah.williams@ntgfreight.com'];
const OpSerTrk1 = ['lia.olarte@ntgfreight.com', 'liliana.barrios@ntgfreight.com'];
const OpSerTrk2 = ['lia.olarte@ntgfreight.com', 'liliana.barrios@ntgfreight.com'];
const OpSerTrkNWkd = ['maria.romero@ntgfreight.com', 'carlos.gomez@ntgfreight.com'];

const eagleTran = ['ian.hess@ntgfreight.com'];

module.exports = {
  //NTG
  '695': {
    '1767': [
      ...receiveAll,
      ...NOC
    ],
    '1843': [
      ...receiveAll,
      ...OpSerTrk1
    ],
    '1845': [
      ...receiveAll,
      ...OpSerTrk2
    ],
    '1847': [
      ...receiveAll,
      ...OpSerTrkNWkd
    ]
  },
  //EAGLE TRAN
  '83': {
    '209': [...eagleTran],
    '211': [...eagleTran],
    '371': [...eagleTran],
    '423': [...eagleTran],
    '431': [...eagleTran],
    '439': [...eagleTran],
    '441': [...eagleTran],
    '467': [...eagleTran],
    '501': [...eagleTran],
    '609': [...eagleTran],
    '681': [...eagleTran],
    '711': [...eagleTran],
    '785': [...eagleTran],
    '815': [...eagleTran],
    '887': [...eagleTran],
    '905': [...eagleTran],
    '913': [...eagleTran],
    '915': [...eagleTran],
    '955': [...eagleTran],
    '981': [...eagleTran],
    '1013': [...eagleTran],
    '1389': [...eagleTran],
    '1511': [...eagleTran],
    '1743': [...eagleTran],
    '1829': [...eagleTran],
    '1831': [...eagleTran],
    '1863': [...eagleTran],
    '1865': [...eagleTran],
    '1867': [...eagleTran],
    '1869': [...eagleTran],
    '1897': [...eagleTran]
  },
  //VOXO
  '37': {
    '161': [
      'docharrod85@gmail.com'
    ]
  }
};
