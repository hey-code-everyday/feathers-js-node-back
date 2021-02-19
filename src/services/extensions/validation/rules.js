// validation rules

const Joi = require('joi');

class Rules {
  constructor() {
    this.string = Joi.string().required();
    this.integer = Joi.number().integer().required();
    this.array = Joi.array();
    this.boolean = Joi.boolean().required();
    this.object = Joi.object();
  }

  getRules() {
    return {
      EXISTINGDEVICE: Joi.object({
        id: this.integer,
      }).optional(),
      NEWDEVICE: Joi.object({
        name: Joi.string().allow(''),
        phPmId: this.integer.allow(null),
        mac: Joi.string().allow(''),
      }).optional(),
      EXTTYPE: this.string.allow('desk').allow('fax').allow('sip').only(),
      TENANTCODE: this.string,
      TENANTId: this.integer,
      BRANCH: Joi.string().allow('').optional(),
      CIDNUM: this.string,
      CIDNUMS: this.array.min(0),
      DEPARTMENT: Joi.string().allow('').optional(),
      EMAIL: Joi.string().trim().email().allow('').optional(),
      EXTNAME: this.string,
      EXTNUMBER: this.string,
      FMFMDIALMETHOD: this.string.allow('Normal').allow('Simultaneous').only(),
      FMFMNUMBER: Joi.string().allow('').optional(),
      FOLLOWME: this.string.allow('on').allow('').only(),
      LOCATION: this.string.trim(),
      PREFIX: this.string.allow(''),
      RECORDING: this.string.allow('yes').allow('no').only(),
      SENDINVITE: this.boolean,
      SIPUSER: this.string.allow('').only(),
      SIPPASS: this.string.allow('').only(),
      UNCONDITIONALSTATUS: this.string.allow('on').allow('').only(),
      VOICEMAILDELIVERY: this.string.allow(''),
      CALLLIMIT: this.integer,
      CIDNUMSCHANGED: this.boolean,
      DEVICE: Joi.object({
        id: this.integer,
        name: this.string,
        phPmId: this.integer.invalid(0),
        mac: this.string,
      }),
      UPDATEDEVICE: Joi.object({
        id: this.integer.allow(null),
        name: this.string.allow(''),
        phPmId: this.integer.invalid(0).allow(null),
        mac: this.string.allow(''),
      }),
      DEVICETYPE: this.string.allow('').valid('New Device', 'Existing Device'),
      DIALTIMEOUT: this.integer,
      DND: this.string.valid('on', ''),
      EMERGENCYCIDNUM: this.integer,
      UPDATEEXISTINGDEVICE: Joi.object({
        id: this.integer.allow(null),
      }),
      UPDATEEXTDST: Joi.object({
        existingId: this.integer.allow(null),
        id: this.integer.allow(null),
        type: this.string.allow(''),
      }),
      EXTHASDEVICE: this.boolean,
      FMFMSTATUS: this.string.valid('on', ''),
      FORWARDINGDESTTYPE: this.string.allow(''),
      FORWARDINGDESTINATION: Joi.object({
        id: this.integer.allow(null),
        number: this.string.allow(null),
      }),
      MUID: this.integer.allow(null),
      UPDATENEWDEVICE: Joi.object({
        name: this.string.allow(''),
        phPmId: this.integer.invalid(0).allow(null),
        mac: this.string.allow(''),
      }),
      REMOVEDEVICE: this.boolean,
    };
  }
}

module.exports = new Rules().getRules();
