//this is just a constants matrix that allows us to return appropriate query
//possibilities for the de_destinations table based on model we are looking for.

module.exports = {
  CAMPAIGN: [
    'CAMPAIGN-ONCONNECT'
  ],

  CONDITION: [
    'CONDITION',
    'NOT CONDITION'
  ],

  CRON: [
    'CRONJOB'
  ],

  CUSTOMTYPE: [
    'CTONANSWER'
  ],

  DID: [
    'DID',
    'DID-SMS',
    'DID-UNCONDITIONAL'
  ],

  EXT: [
    'EXT-BUSY',
    'EXT-NOANSWER',
    'EXT-OFFLINE',
    'EXT-ONCONDITION',
    'EXT-UNCONDITIONAL'
  ],

  FEATURE: [
    'FEATURE'
  ],

  FLOW: [
    'FLOW'
  ],

  HUNTLIST: [
    'HUNTLIST',
    'HUNTLIST-TIMEOUT'
  ],

  IVR: [
    'IVR_0',
    'IVR_1',
    'IVR_2',
    'IVR_3',
    'IVR_4',
    'IVR_5',
    'IVR_6',
    'IVR_7',
    'IVR_8',
    'IVR_9',
    'IVR_MEDIAFILE',
    'IVR_SHARP',
    'IVR_STAR',
    'IVR_TIMEOUT',
    'IVR_WRONG',
    'CUSTOMIVR_302'
  ],

  MUSICONHOLD: [
    'MUSICONHOLD'
  ],

  PAGINGGROUP: [
    'PAGING'
  ],

  QUEUE: [
    'QUEUE-EXITKEY',
    'QUEUE-FULL',
    'QUEUE-NOBODYHOME',
    'QUEUE-NOFREEMEMBER',
    'QUEUE-PERIODICANNOUNCE',
    'QUEUE-TIMEOUT'
  ],

  VOICEMAIL: [
    'VOICEMAIL-OPERATOR'
  ]
};