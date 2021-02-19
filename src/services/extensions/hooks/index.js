const { Forbidden } = require('@feathersjs/errors');
const extDefaults = require('../validation/defaults');
const vmDefaults = require('../../voicemails/validations/defaults');
const moment = require('moment');
const { db } = require('../../../child-processes/db');

//validation params
const validate = require('@feathers-plus/validate-joi');
const { schema, updateSchema, joiOptions } = require('../validation/schema');

// Extension Creation Validation
exports.validateCreate = function () {
  return validate.form(schema, joiOptions);
};

exports.validatePatch = function () {
  return validate.form(updateSchema, joiOptions);
};

const findExtType = (rpid, trunk) => {
  if (rpid === 0 && trunk === '') {
    return 'desk';
  } else if (rpid === 0 && trunk === 'yes') {
    return 'sip';
  } else if (rpid === 9) {
    return 'fax';
  }
};

exports.afterGetExt = () => async (context) => {
  const { rpid, trunk } = context.result;

  context.result.type = findExtType(rpid, trunk);

  const destinations = await context.app.service('destinations').find({
    query: {
      typeIdDst: context.result.id,
      typeDst: 'EXT',
      tenantId: context.result.tenantId,
      typeSrc: 'DID',
    },
  });

  const numberIds = destinations.map((item) => item.typeIdSrc);

  const res = await context.app.service('dids')._find({
    query: {
      id: { $in: numberIds },
    },
  });
  context.result.cidNums = res.data || res;

  const device = await context.app.service('devices').find({
    query: {
      phLine1ExId: context.result.id,
    },
  });
  if (device.length) {
    const { id, name, mac, phPmId } = device[0];
    context.result.device = { id, name, mac, phPmId };
  }
  return context;
};

exports.beforeCreateExt = function () {
  return async (context) => {
    const { userRole, tenantIds } = context.params.user;
    const {
      extName,
      extNumber,
      email,
      branch,
      department,
      location,
      unconditionalStatus,
      fmfmNumber,
      fmfmDialMethod,
      recording,
      prefix,
      tenantId,
      cidNum,
      extType,
      callLimit,
      followMe,
    } = context.data;

    //if user role is not super admin check allowed tenants
    if (+userRole !== 1) {
      if (!tenantIds.includes(+tenantId)) {
        throw new Forbidden('You do not have permissions for this Account!');
      }
    }

    //create sipfriends entry first
    const sipFriend = await context.app
      .service('sipfriends')
      .create(context.data);

    //check callerId field to assign cidNum. If none, assign to first of selected cidNums
    //this brings up the question of what we are doing with the rest of the cidNums selected :)
    // let cidNum = callerIdNum.length ? callerIdNum : cidNums[0];

    //check the extType (fax, siptrunk, device)
    //based on type we will set rpid, faxGateway, includeinPb
    let faxGateway = 'no';
    let dialTimeout = 0;

    let trunkEmergencyCidOverride = 'number';
    let trunkCidSource = 'auto';
    let trunk = '';

    let rpid;
    if (extType === 'fax') {
      faxGateway = 'storeandforward';
      rpid = 9;
      dialTimeout = 45;
    }

    if (extType === 'sip') {
      rpid = 0;
      trunkEmergencyCidOverride = 'none';
      trunk = 'yes';
      trunkCidSource = 'PAI';
    }

    //if type device .. include in phonebook
    let includeInPb = extType === 'desk' ? 'yes' : 'no';

    if (extType === 'desk') {
      rpid = 0;
    }

    //check for 7 digit dialing area code
    //this will help us set the regex prefix
    let regexPrefix = prefix.length ? '^[0-9]{7,7}$' : '';

    //check find me follow me status
    //this will help us set fmfmStatus
    let fmfmStatus = followMe ? 'on' : '';

    //set all post data on a different key to no interfere with extension create data
    context.params.postData = { ...context.data };
    const createBody = {
      tenantId,
      name: extName,
      number: extNumber,
      cidName: extName,
      cidNum,
      email,
      branch,
      department,
      emergencyCidNum: location,
      rpid,
      techId: sipFriend.id,
      dateCreation: new moment().format('YYYY-MM-DD HH:mm:ss'),
      unconditionalStatus,
      fmfmStatus,
      fmfmNumber,
      fmfmDialMethod,
      recording,
      faxGateway,
      includeInPb,
      regexPrefix,
      prefix,
      dialTimeout,
      trunkEmergencyCidOverride,
      trunk,
      trunkCidSource,
      callLimit,
    };

    context.data = {
      ...createBody,
      ...extDefaults,
    };

    return context;
  };
};

const addDestinations = async (createDestinationData, destinationService) => {
  const typeSrces = ['EXT-NOANSWER', 'EXT-BUSY', 'EXT-OFFLINE'];

  const createBody = typeSrces.map((typeSrc) => {
    return {
      typeSrc,
      ...createDestinationData,
    };
  });
  await destinationService._create(createBody);
};

const insertDialByNameRecords = async (name, tenantId, extensionId) => {
  const textToKeypad = (text) => {
    const phoneCharMap = {
      a: '2',
      b: '2',
      c: '2',
      d: '3',
      e: '3',
      f: '3',
      g: '4',
      h: '4',
      i: '4',
      j: '5',
      k: '5',
      l: '5',
      m: '6',
      n: '6',
      o: '6',
      p: '7',
      q: '7',
      r: '7',
      s: '7',
      t: '8',
      u: '8',
      v: '8',
      w: '9',
      x: '9',
      y: '9',
      z: '9',
      '+': '00',
      ' ': '',
    };
    const _text = text.split('');
    return _text
      .map((char) => {
        const number = phoneCharMap[char.toLowerCase()];
        if (number) return phoneCharMap[char.toLowerCase()];
        return char;
      })
      .join('');
  };

  const digits = await textToKeypad(name.split(' ')[0]).substring(0, 3);

  await db.execute(
    `insert into dn_dialbyname(dn_te_id,dn_type,dn_type_id,dn_number) values (${tenantId},'EXT',${extensionId},${digits})`
  );
};

exports.afterCreateExt = () => async (context) => {
  const {
    tenantId,
    tenantCode,
    extName: fullName,
    extNumber: mailbox,
    email,
    cidNums,
    extType,
  } = context.params.postData;

  const extensionId = context.result.id;

  const voicemailService = context.app.service('voicemails');
  const destinationService = context.app.service('destinations');
  const didsService = context.app.service('dids');
  const extStatus = context.app.service('extension-status');

  // Entry into st_states table
  await extStatus.create({
    extension: mailbox + '-' + tenantCode,
    state: 'UNAVAILABLE',
    server: '',
  });

  /* Add Ext destination and Sms destination for posted cidNums */
  /* For each posted cidNums patch the 'di_comment' to newly created extension number(context.result.number) */
  if (cidNums.length) {
    const createDataForExt = [];
    const createDataForSms = [];

    cidNums.forEach(async (de_id) => {
      await didsService.patch(de_id, {
        diCommentName: context.result.number,
      });

      const createBody = {
        tenantId,
        typeIdSrc: de_id,
        typeIdDst: extensionId,
        order: 1,
      };
      // For EXTENSION
      createDataForExt.push({
        ...createBody,
        typeSrc: 'DID',
        typeDst: 'EXT',
      });

      // For SMS
      if (extType === 'desk') {
        createDataForSms.push({
          ...createBody,
          typeSrc: 'DID-SMS',
          typeDst: 'SMS',
        });
      }
    });
    await destinationService._create(createDataForExt);
    await destinationService.create(createDataForSms);
  }

  // For Desk/Mobile
  if (extType === 'desk') {
    // Check for existing voicemail
    const voicemail = await voicemailService.find({
      query: { tenantId, mailbox },
    });

    // If voicemail already exists, add destinations for No Answer, Busy and Offline
    const createDestinationBody = {
      tenantId,
      typeIdSrc: extensionId,
      typeDst: 'VOICEMAIL',
      order: 1,
    };
    if (voicemail.length) {
      addDestinations(
        { ...createDestinationBody, typeIdDst: voicemail[0].id },
        destinationService
      );
    } else {
      const pin = Math.floor(Math.random() * 8999 + 1000);
      let createBody = {
        tenantId,
        context: tenantCode,
        mailbox,
        fullName,
        email,
        password: pin,
      };

      const voicemail = await voicemailService._create({
        ...createBody,
        ...vmDefaults,
      });

      addDestinations(
        { ...createDestinationBody, typeIdDst: voicemail.id },
        destinationService
      );
    }

    // Insert dial by Name Records
    await insertDialByNameRecords(context.result.name, tenantId, extensionId);

    // IF DNCList is selected insert the destinations
    const donotcallId = context.params.postData.dcId;
    if (donotcallId) {
      const destination = await destinationService.find({
        query: { tenantId, typeSrc: 'EXT-DONOTCALL', typeIdSrc: extensionId },
      });

      if (destination.length) {
        await destinationService.remove(destination[0].id);
      }

      await destinationService.create({
        tenantId,
        typeSrc: 'EXT_DONOTCALL',
        typeIdSrc: extensionId,
        typeDst: 'DONOTCALL',
        typeIdDst: donotcallId,
        order: 1,
      });
    }

    // If send invite box is checked and user does not already exist create omnia user
    const userService = context.app.service('users');
    if (context.params.postData.sendInvite) {
      const user = await userService.find({ query: { tenantId, email } });
      if (!user.length) {
        const createBody = {
          tenantId,
          receiveQueueReports: 0,
          userRole: '5',
          extension: context.result.number,
          email,
          us_useldap: '',
          tenantIds: [],
          adminQueues: [],
        };
        await userService.create(createBody);
      }
    }
  }

  // Add device
  const deviceService = context.app.service('devices');
  const existingDevice = context.params.postData.existingDevice;
  const newDevice = context.params.postData.newDevice;

  if (extType === 'desk' || extType === 'fax') {
    // Check for existing device or new device
    if (existingDevice) {
      await deviceService.patch(existingDevice.id, {
        phLine1ExId: extensionId,
      });
    } else if (newDevice) {
      const { name, mac, phPmId } = newDevice;
      const createBody = {
        tenantId,
        name,
        mac,
        password: '',
        phLine1ExId: extensionId,
        phPmId: Number(phPmId),
        filename: '',
      };

      await deviceService.create(createBody);
    }
  }

  // Perform queries for callgroups and pickupgroups
  const callgroupService = context.app.service('callgroups');
  const pickupService = context.app.service('pickupgroups');

  const query = { query: { tenantId, extensionId } };
  const callgroup = await callgroupService.find(query);
  if (callgroup.length) {
    await callgroupService.remove(callgroup[0].id);
  }

  const pickupgroup = await pickupService.find(query);
  if (pickupgroup.length) {
    await pickupService.remove(pickupgroup[0].id);
  }

  const body = {
    tenantId,
    extensionId,
    value: '1',
  };

  await callgroupService.create(body);
  await pickupService.create(body);

  return context;
};

exports.beforePatchExt = () => async (context) => {
  try {
    const {
      tenantId,
      extName,
      extNumber,
      extType,
      email,
      cidNumsChanged,
      cidNums,
      extHasDevice,
      removeDevice,
      device,
      deviceType,
      newDevice,
      existingDevice,
      prefix,
      unconditionalStatus,
      forwardingDestination,
      forwardingDestType,
      extBusy,
      extOffline,
      extNoAnswer,
      sendInvite,
    } = context.data;

    const isChanged = (a, b) => a !== b;

    const extBeforePatch = await context.app
      .service('extensions')
      ._get(context.id);

    const voicemailService = context.app.service('voicemails');
    const voicemailMsgService = context.app.service('voicemail-messages');
    const destinationService = context.app.service('destinations');
    const didsService = context.app.service('dids');

    // Grab the tenantCode
    const { tenantCode } = await context.app
      .service('tenants')
      ._get(extBeforePatch.tenantId);

    const vmMsgsToBeUpdated = await voicemailMsgService._find({
      query: {
        mailboxContext: tenantCode,
        mailboxuser: extBeforePatch.number,
      },
    });

    // ⭐️ Extension Number ⭐️ //
    if (isChanged(extBeforePatch.number, extNumber)) {
      // Update the related the sipfriend (reference to beforeCreateSipFriend hooks)
      const sipService = context.app.service('sipfriends');
      sipService._patch(extBeforePatch.techId, {
        name: extNumber + '-' + tenantCode,
        defaultUser: extNumber + '-' + tenantCode,
        fullcontact: null,
        mailbox: extType === 'desk' ? extNumber + '@' + tenantCode : '',
        callerId: extName + '<' + extNumber + '>',
      });

      // create a new entry in st_states table (extension-status service)
      const extensionStatusService = context.app.service('extension-status');
      extensionStatusService._create({
        extension: extNumber + '-' + tenantCode,
        state: 'UNAVAILABLE',
        server: '',
      });

      // update the voicemails for the extension
      await voicemailService._patch(
        null,
        {
          mailbox: extNumber,
        },
        {
          query: {
            tenantId: extBeforePatch.tenantId,
            mailbox: extBeforePatch.number,
          },
        }
      );

      // update voicemail messages table for this extension
      if (vmMsgsToBeUpdated.length) {
        for (let i = 0; i < vmMsgsToBeUpdated.length; i++) {
          const msg = vmMsgsToBeUpdated[i];
          let dirStrs = msg.dir.split('/');
          dirStrs[6] = extNumber;

          await voicemailMsgService._patch(msg.id, {
            mailboxuser: extNumber,
            dir: dirStrs.join('/'),
          });
        }
      }
    }

    // ⭐️ Extension Name ⭐️ //
    if (isChanged(extBeforePatch.name, extName)) {
      // Update the callerId of related sipFriend
      const sipService = context.app.service('sipfriends');
      sipService._patch(extBeforePatch.techId, {
        callerId: extName + '<' + extNumber + '>',
      });

      // Update the fullName field of related Voicemail
      await voicemailService._patch(
        null,
        {
          fullName: extName,
        },
        {
          query: {
            tenantId: extBeforePatch.tenantId,
            mailbox: extBeforePatch.number,
          },
        }
      );

      // Rebuild the dial by name entries
      // 1. Delete the existing one
      await db.execute(
        `delete from dn_dialbyname where dn_type_id = ${extBeforePatch.id} and dn_type = 'EXT'`
      );
      // 2. Create new one
      await insertDialByNameRecords(
        extName,
        extBeforePatch.tenantId,
        extBeforePatch.id
      );
    }

    // ⭐️ Assign Available Numbers ⭐️ //
    if (cidNumsChanged) {
      // ⭐️ Delete old SMS and EXT destinations for this extension ID ⭐️ //
      const removedDestinations = await destinationService._remove(null, {
        query: {
          typeIdDst: context.id,
          typeDst: { $in: ['EXT', 'SMS'] },
          tenantId: extBeforePatch.tenantId,
        },
      });

      // ⭐️ Create new destinations with the supplied numbers ⭐️ //
      if (cidNums.length) {
        const createDataForExt = [];
        const createDataForSms = [];

        cidNums.forEach(async (de_id) => {
          await didsService.patch(de_id, {
            diCommentName: context.result.number,
          });

          const createBody = {
            tenantId,
            typeIdSrc: de_id,
            typeIdDst: context.id,
            order: 1,
          };
          // For EXTENSION
          createDataForExt.push({
            ...createBody,
            typeSrc: 'DID',
            typeDst: 'EXT',
          });

          // For SMS
          if (extType === 'desk') {
            createDataForSms.push({
              ...createBody,
              typeSrc: 'DID-SMS',
              typeDst: 'SMS',
            });
          }
        });
        await destinationService._create(createDataForExt);
        await destinationService._create(createDataForSms);

        // ⭐️ Remove di_comment (set to an empty string) ⭐️ //
        if (removedDestinations.length) {
          removedDestinations.forEach(async ({ typeIdSrc }) => {
            if (!cidNums.includes(typeIdSrc)) {
              await didsService.patch(typeIdSrc, {
                diCommentName: '',
              });
            }
          });
        }
      }
    }

    // ⭐️ 7 Digit Dialing Code ⭐️ //
    //this will help us set the regex prefix
    context.data.regexPrefix = prefix.length ? '^[0-9]{7,7}$' : '';

    // ⭐️ Device ⭐️ //
    const deviceService = context.app.service('devices');

    const addDevice = async (deviceType) => {
      if (deviceType === 'New Device') {
        const { name, mac, phPmId } = newDevice;

        const createBody = {
          tenantId,
          name,
          mac,
          password: '',
          phLine1ExId: context.id,
          phPmId: Number(phPmId),
          filename: '',
        };
        await deviceService._create(createBody);
      } else if (deviceType === 'Existing Device') {
        await deviceService.patch(existingDevice.id, {
          phLine1ExId: context.id,
        });
      }
    };

    if (extType === 'fax' || extType === 'desk') {
      const { id, name, mac, phPmId } = device;

      if (extHasDevice) {
        if (removeDevice) {
          await deviceService._patch(id, { phLine1ExId: 0 });

          await addDevice(deviceType);
        } else {
          await deviceService._patch(id, { name, mac, phPmId });
        }
      } else {
        await addDevice(deviceType);
      }
    }

    if (extType === 'desk') {
      // ⭐️ Email ⭐️ //
      if (isChanged(extBeforePatch.email, email)) {
        // update voicemail (email field)
        await voicemailService._patch(
          null,
          {
            email,
          },
          {
            query: {
              tenantId: extBeforePatch.tenantId,
              mailbox: extBeforePatch.number,
            },
          }
        );
      }

      // ⭐️ If Forward All Calls is Checked ⭐️ //
      if (unconditionalStatus === 'on') {
        // ⭐️ Remove the old record if any ⭐️ //
        const oldDst = await destinationService.find({
          query: {
            tenantId,
            typeSrc: 'EXT-UNCONDITIONAL',
            typeIdSrc: context.id,
          },
        });

        if (oldDst.length) {
          await destinationService.remove(oldDst[0].id);
        }

        // ⭐️ If User has selected a custom destination, Create a new destination⭐️ //
        if (forwardingDestination.id) {
          await destinationService.create({
            tenantId,
            typeSrc: 'EXT-UNCONDITIONAL',
            typeIdSrc: context.id,
            typeDst: forwardingDestType,
            typeIdDst: forwardingDestination.id,
            order: 1,
          });

          // ⭐️ User inputs a custom number ⭐️ //
        } else if (forwardingDestination.number) {
          // ⭐️ Create cu_custom record first ⭐️ //
          const customsService = context.app.service('customs');
          const existingCustom = await customsService.find({
            query: { name: forwardingDestination.number },
          });

          if (existingCustom.length) {
            await destinationService.create({
              tenantId,
              typeSrc: 'EXT-UNCONDITIONAL',
              typeIdSrc: context.id,
              typeDst: 'CUSTOM',
              typeIdDst: existingCustom[0].id,
              order: 1,
            });
          } else {
            const newCustom = await customsService.create({
              tenantId,
              cu_ct_id: 1,
              name: forwardingDestination.number,
              param1: forwardingDestination.number,
              param2: 'ORIGINAL',
              param3: 30,
              param4: '',
              param5: '',
              param6: '',
              param7: '',
              param8: '',
              param9: '',
              param10: '',
            });
            // ⭐️ Create new destination ⭐️ //

            await destinationService.create({
              tenantId,
              typeSrc: 'EXT-UNCONDITIONAL',
              typeIdSrc: context.id,
              typeDst: 'CUSTOM',
              typeIdDst: newCustom.id,
              order: 1,
            });
          }
        }
      }

      // ⭐️ PATCH the existing Destinations ⭐️ //
      if (extBusy.id) {
        const { existingId, type, id } = extBusy;
        await destinationService.patch(existingId, {
          typeDst: type,
          typeIdDst: id,
        });
      }
      if (extOffline.id) {
        const { existingId, type, id } = extOffline;
        await destinationService.patch(existingId, {
          typeDst: type,
          typeIdDst: id,
        });
      }
      if (extNoAnswer.id) {
        const { existingId, type, id } = extNoAnswer;
        await destinationService.patch(existingId, {
          typeDst: type,
          typeIdDst: id,
        });
      }
    }

    // ⭐️ SendInvite ⭐️ //
    const userService = context.app.service('users');
    if (sendInvite) {
      const user = await userService.find({ query: { tenantId, email } });
      if (user.data.length) {
        await userService.patch(user.data[0].id, { resetPass: true });
      } else {
        const createBody = {
          tenantId,
          receiveQueueReports: 0,
          userRole: '5',
          extension: extNumber,
          email,
          us_useldap: '',
          tenantIds: [],
          adminQueues: [],
        };
        await userService.create(createBody);
      }
    }

    context.data.name = extName;
    context.data.number = extNumber;
    return context;
  } catch (err) {
    console.log(err);
  }
};

exports.afterDeleteExt = () => async (context) => {
  // console.log(context.result);

  const { id: extId, techId, tenantId, number, rpid, trunk } = context.result;

  // Grab the tenantCode
  const { tenantCode } = await context.app.service('tenants')._get(tenantId);

  const extType = findExtType(rpid, trunk);

  // ⭐️ Remove The Sip Friend Entry ⭐️ //
  await context.app.service('sipfriends')._remove(techId);

  // ⭐️ Remove entry from st_states table ⭐️ //
  const extStatusService = context.app.service('extension-status');
  await extStatusService._remove(null, {
    query: {
      extension: number + '-' + tenantCode,
      state: 'UNAVAILABLE',
    },
  });

  const destinationService = context.app.service('destinations');

  // ⭐️ Desk Type ⭐️ //
  if (extType === 'desk') {
    // ⭐️ Remove the Voicemailbox ⭐️ //
    await context.app.service('voicemails')._remove(null, {
      query: {
        tenantId,
        mailbox: number,
      },
    });

    await destinationService._remove(null, {
      query: {
        typeDst: 'VOICEMAIL',
        typeIdSrc: extId,
      },
    });

    // ⭐️ Remove SMS Destination ⭐️ //
    await destinationService._remove(null, {
      query: {
        typeSrc: 'DID-SMS',
        typeDst: 'SMS',
        typeIdDst: extId,
      },
    });

    // ⭐️ EXT-OFFLINE, EXT-BUSY, EXT-NOANSWER ⭐️ //
    await destinationService._remove(null, {
      query: {
        typeSrc: {
          $in: [
            'EXT-BUSY',
            'EXT-OFFLINE',
            'EXT-NOANSWER',
            'EXT-ONCONDITION',
            'EXT-UNCONDITIONAL',
          ],
        },
        typeIdSrc: extId,
      },
    });

    // ⭐️ Remove Dial By Name Entries on tenantId and extension number ⭐️ //
    await db.execute(
      `delete from dn_dialbyname where dn_te_id = ${tenantId} AND dn_type = 'EXT' AND dn_type_id = ${extId}`
    );

    // ⭐️ Remove DONOTCALL destination ⭐️ //
    await destinationService._remove(null, {
      query: {
        typeSrc: 'EXT_DONOTCALL',
        typeIdSrc: extId,
      },
    });
  }

  // ⭐️ Remove DID destination ⭐️ //
  await destinationService._remove(null, {
    query: {
      typeSrc: 'DID',
      typeDst: 'EXT',
      typeIdDst: extId,
    },
  });

  // ⭐️ Patch Assigned Device ⭐️ //
  if (extType !== 'sip') {
    const deviceService = context.app.service('devices');

    deviceService._patch(
      null,
      {
        phLine1ExId: 0,
      },
      {
        query: {
          phLine1ExId: extId,
        },
      }
    );
  }

  // ⭐️ Remove Call Groups and Pickup Groups Records. ⭐️ //
  const callgroupService = context.app.service('callgroups');
  const pickupService = context.app.service('pickupgroups');

  const query = { query: { tenantId, extensionId: extId } };
  await callgroupService._remove(null, query);
  await pickupService._remove(null, query);

  return context;
};

exports.checkGetAuth = function () {
  return async (context) => {
    const { tenantId, email } = context.result;

    //we have access to the user making the request, so we can check the role id and customize the query accordingly.
    const { userRole, tenantIds } = context.params.user;
    const userEmail = context.params.user.email;

    if (+userRole === 5 || +userRole === 7) {
      if (email.toLowerCase() === userEmail.toLowerCase()) {
        return context;
      } else {
        throw new Forbidden('You cannot access this extension!');
      }
    }

    //if user role is 3 we only want to allow the tenants they are authorized for.
    if (+userRole !== 1) {
      if (!tenantIds.includes(tenantId)) {
        throw new Forbidden(
          'Not Authorized. You Do Not Have Permission to Access This Record'
        );
      }
    }

    return context;
  };
};
