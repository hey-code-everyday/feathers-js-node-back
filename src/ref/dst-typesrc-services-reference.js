module.exports = (type) => {
  if (type === 'CAMPAIGN-ONCONNECT') {
    return 'campaigns';
  } else if (type === 'CONDITION' || type === 'NOTCONDITION') {
    return 'conditions';
  } else if (type === 'CRONJOB') {
    return 'cronjobs';
  } else if (type === 'CTONANSWER') {
    return 'customs';
  } else if (
    type === 'CUSTOMIVR_302' ||
    type === 'IVR_0' ||
    type === 'IVR_1' ||
    type === 'IVR_2' ||
    type === 'IVR_3' ||
    type === 'IVR_4' ||
    type === 'IVR_5' ||
    type === 'IVR_6' ||
    type === 'IVR_7' ||
    type === 'IVR_8' ||
    type === 'IVR_9' ||
    type === 'IVR_MEDIAFILE' ||
    type === 'IVR_SHARP' ||
    type === 'IVR_STAR' ||
    type === 'IVR_TIMEOUT' ||
    type === 'IVR_WRONG'
  ) {
    return 'ivrs';
  } else if (
    type === 'DID' ||
    type === 'DID-SMS' ||
    type === 'DID-UNCONDITIONAL'
  ) {
    return 'dids';
  } else if (
    type === 'EXT-BUSY' ||
    type === 'EXT-NOANSWER' ||
    type === 'EXT-OFFLINE' ||
    type === 'EXT-ONCONDITION' ||
    type === 'EXT-UNCONDITIONAL'
  ) {
    return 'extensions';
  } else if (type === 'FEATURE') {
    return 'features';
  } else if (type === 'FLOW') {
    return 'flows';
  } else if (type === 'HUNTLIST' || type === 'HUNTLIST-TIMEOUT') {
    return 'huntlists';
  } else if (type === 'MUSICONHOLD') {
    return 'musiconholds';
  } else if (type === 'PAGING') {
    return 'paging-groups';
  } else if (
    type === 'QUEUE-EXITKEY' ||
    type === 'QUEUE-FULL' ||
    type === 'QUEUE-NOBODYHOME' ||
    type === 'QUEUE-NOFREEMEMBER' ||
    type === 'QUEUE-PERIODICANNOUNCE' ||
    type === 'QUEUE-TIMEOUT'
  ) {
    return 'queues';
  } else if (type === 'VOICEMAIL-OPERATOR') {
    return 'voicemails';
  }
};
