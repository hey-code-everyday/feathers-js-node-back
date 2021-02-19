

module.exports = (type, models) => {

  switch(type) {

  case 'CONDITION':
    return models.conditions;
  case 'CUSTOM':
    return models.custom_types;
  case 'DISA':
    return models.disas;
  case 'DISABLEUNCONDITIONALDID':
    return models.dids;
  case 'ENABLECONDITIONALDID':
    return models.dids;
  case 'EXT':
    return models.extensions;
  case 'HUNTLIST':
    return models.huntlists;
  case 'IVR':
    return models.ivrs;
  case 'LOGINADQUEUE':
    return models.queuemembers;
  case 'LOGOUTQUEUE':
    return models.queuemembers;
  case 'MEDIAFILE':
    return models.mediafiles;
  case 'MEETME':
    return models.conference_bridges;
  case 'PLAYBACK':
    return models.mediafiles;
  case 'QUEUE':
    return models.queues;
  case 'RERECORD':
    return models.mediafiles;
  case 'SETUNCONDITIONALDID':
    return models.dids;
  case 'SMS':
    return models.dids;
  case 'SPECIAL':
    return models.specials;
  case 'TOGGLEPAUSEQUEUE':
    return models.queuemembers;
  case 'TOGGLEUNCONDITIONALDID':
    return models.dids;
  case 'VOICEMAIL':
    return models.voicemails;
  default:
    return false;
  }

};