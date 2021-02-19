

module.exports = (type) => {

  switch(type) {

  case 'CONDITION':
    return {
      prefix: 'Condition',
      field: 'name'
    };
  case 'CUSTOM':
    return {
      prefix: 'Custom',
      field: 'name'
    };
  case 'DISA':
    return {
      prefix: 'Disa',
      field: 'name'
    };
  case 'DISABLEUNCONDITIONALDID':
    return {
      prefix: 'DID',
      field: 'diCommentName'
    };
  case 'ENABLECONDITIONALDID':
    return {
      prefix: 'DID',
      field: 'diCommentName'
    };
  case 'EXT':
    return {
      prefix: 'Extension',
      field: 'name'
    };
  case 'HUNTLIST':
    return {
      prefix: 'Huntlist',
      field: 'name'
    };
  case 'IVR':
    return {
      prefix: 'IVR',
      field: 'name'
    };
  case 'LOGINADQUEUE':
    return {
      prefix: '',
      field: ''
    };
  case 'LOGOUTQUEUE':
    return {
      prefix: '',
      field: ''
    };
  case 'MEDIAFILE':
    return {
      prefix: 'Media File',
      field: 'name'
    };
  case 'MEETME':
    return {
      prefix: '',
      name: ''
    };
  case 'PLAYBACK':
    return {
      prefix: 'Playback',
      field: 'name'
    };
  case 'QUEUE':
    return {
      prefix: 'Queue',
      field: 'name'
    };
  case 'RERECORD':
    return {
      prefix: '',
      name: ''
    };
  case 'SETUNCONDITIONALDID':
    return {
      prefix: 'DID',
      field: 'diCommentName'
    };
  case 'SMS':
    return {
      prefix: 'SMS',
      field: 'diCommentName'
    };
  case 'SPECIAL':
    return {
      prefix: 'SPECIAL',
      field: 'code'
    };
  case 'TOGGLEPAUSEQUEUE':
    return {
      prefix: '',
      field: ''
    };
  case 'TOGGLEUNCONDITIONALDID':
    return {
      prefix: '',
      field: ''
    };
  case 'VOICEMAIL':
    return {
      prefix: 'VOICEMAIL BOX',
      field: 'mailbox'
    };
  default:
    return false;
  }

};
