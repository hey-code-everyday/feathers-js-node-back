const ivrDefaults = require('../validation/defaults');

const validate = require('@feathers-plus/validate-joi');
const { updateSchema, schema, joiOptions } = require('../validation/schema');

exports.validateCreate = function () {
  return validate.form(schema, joiOptions);
};

exports.validatePatch = function () {
  return validate.form(updateSchema, joiOptions);
};

exports.afterGetIvr = () => async (context) => {
  const destinationService = context.app.service('destinations');

  // ⭐️ phoneNums ⭐️ //
  const destinations = await destinationService._find({
    query: {
      tenantId: context.result.tenantId,
      typeSrc: 'DID',
      typeDst: 'IVR',
      typeIdDst: context.result.id,
    },
  });

  const numberIds = destinations.map((item) => item.typeIdSrc);

  const res = await context.app.service('dids')._find({
    query: {
      id: { $in: numberIds },
    },
  });

  context.result.phoneNums = res.data || res;

  return context;
};

exports.beforeCreateIvr = () => async (context) => {
  context.params.postData = { ...context.data };

  context.data = {
    ...context.data,
    ...ivrDefaults,
  };

  return context;
};

exports.afterCreateIvr = () => async (context) => {
  const destinationService = context.app.service('destinations');
  const {
    tenantId,
    phoneNums,
    timeoutDst,
    wrongKeyPressDst,
  } = context.params.postData;

  const ivrId = context.result.id;

  // ⭐️ Assign Phone Numbers ⭐️ //
  if (phoneNums.length) {
    const createData = phoneNums.map((id) => {
      return {
        tenantId,
        typeSrc: 'DID',
        typeIdSrc: id,
        typeDst: 'IVR',
        typeIdDst: ivrId,
        order: 1,
      };
    });
    await destinationService._create(createData);
  }

  // ⭐️ Timeout Destination ⭐️ //
  if (timeoutDst.id) {
    await destinationService.create({
      tenantId,
      typeSrc: 'IVR_TIMEOUT',
      typeIdSrc: ivrId,
      typeDst: timeoutDst.type,
      typeIdDst: timeoutDst.id,
      order: 1,
    });
  }

  // ⭐️ Wrong Key Press Destination ⭐️ //
  if (wrongKeyPressDst.id) {
    await destinationService.create({
      tenantId,
      typeSrc: 'IVR_WRONG',
      typeIdSrc: ivrId,
      typeDst: wrongKeyPressDst.type,
      typeIdDst: wrongKeyPressDst.id,
      order: 1,
    });
  }

  // ⭐️ Virtual Receptionist Options ⭐️ //
  let destData = [];

  const keys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'SHARP', 'STAR'];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const keyDst = context.params.postData[`key${key}Dst`];
    if (keyDst.id) {
      destData.push({
        tenantId,
        typeSrc: `IVR_${key}`,
        typeIdSrc: ivrId,
        typeDst: keyDst.type,
        typeIdDst: keyDst.id,
        order: 1,
      });
    }
  }

  if (destData.length) {
    destinationService.create(destData);
  }

  return context;
};

exports.beforePatchIvr = () => async (context) => {
  const {
    tenantId,
    phoneNumsChanged,
    phoneNums,
    timeoutDst,
    wrongKeyPressDst,
  } = context.data;
  const ivrId = context.id;

  const destinationService = context.app.service('destinations');

  // ⭐️ Assign Phone Numbers ⭐️ //
  if (phoneNumsChanged) {
    // ⭐️ Delete Old Destinations for this ivrId ⭐️ //
    await destinationService._remove(null, {
      query: {
        tenantId,
        typeSrc: 'DID',
        typeDst: 'IVR',
        typeIdDst: ivrId,
        order: 1,
      },
    });

    // ⭐️ Create new destinations with the supplied numbers ⭐️ //
    if (phoneNums.length) {
      const createData = phoneNums.map((id) => {
        return {
          tenantId,
          typeSrc: 'DID',
          typeIdSrc: id,
          typeDst: 'IVR',
          typeIdDst: ivrId,
          order: 1,
        };
      });
      await destinationService._create(createData);
    }
  }

  // ⭐️ Timeout Destination ⭐️ //
  if (timeoutDst.id) {
    const { existingId, type, id } = timeoutDst;

    await destinationService._patch(existingId, {
      typeDst: type,
      typeIdDst: id,
    });
  }

  // ⭐️ Wrong Key Press Destination ⭐️ //
  if (wrongKeyPressDst.id) {
    const { existingId, type, id } = wrongKeyPressDst;

    await destinationService._patch(existingId, {
      typeDst: type,
      typeIdDst: id,
    });
  }

  // ⭐️ Virtual Receptionist Options ⭐️ //
  const keys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'SHARP', 'STAR'];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const keyDst = context.data[`key${key}Dst`];
    const { existingId, type, id } = keyDst;
    if (id) {
      await destinationService._patch(existingId, {
        typeDst: type,
        typeIdDst: id,
      });
    }
  }
  return context;
};

exports.afterDeleteIvr = () => async (context) => {
  const { tenantId } = context.result;
  const ivrId = context.result.id;

  const destinationService = context.app.service('destinations');

  await destinationService._remove(null, {
    query: {
      tenantId,
      typeIdSrc: ivrId,
      typeSrc: {
        $in: [
          'IVR_TIMEOUT',
          'IVR_WRONG',
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
          'IVR_SHARP',
          'IVR_STAR',
          'IVR_MEDIAFILE',
        ],
      },
    },
  });

  await destinationService._remove(null, {
    query: {
      tenantId,
      typeDst: 'IVR',
      typeIdDst: ivrId,
    },
  });

  return context;
};
