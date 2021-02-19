const validate = require('@feathers-plus/validate-joi');
const {
  schema_CREATE,
  schema_UPDATE,
  joiOptions,
} = require('../validation/schema');
const { Forbidden, BadRequest } = require('@feathersjs/errors');

const {
  iq_authenticate,
  iq_tnOrder,
  iq_updateNumber,
  iq_tnDisconnect,
} = require('../../../inteliquent/api');
const getIqParams = require('../../../inteliquent/inteliquent-params');

const getDstModel = require('../../../ref/dst-models-reference');
const didDefaults = require('../validation/defaults');

exports.addDidDestinations = function () {
  return async (context) => {
    const sequelize = context.app.get('sequelizeClient');
    const Models = sequelize.models;
    const { de_destinations } = context.result;

    //if we happen to return multiple typeSrc = DID we only get the first result and write it to the object.
    let commentAdded = 0;
    const primaryDes = [
      'CONDITION',
      'EXT',
      'HUNTLIST',
      'IVR',
      'MEETME',
      'QUEUE',
      'VOICEMAIL',
    ];

    //nest the actual destination for each de_destinations record. Add diComment (primary destination)
    for (let i = 0; i < de_destinations.length; i++) {
      let dstModel = getDstModel(de_destinations[i].typeDst, Models);
      let queryModel = await getModel(de_destinations[i], dstModel);

      if (queryModel) {
        context.result.de_destinations[i].destination = queryModel;
        if (primaryDes.includes(de_destinations[i].typeDst) && !commentAdded) {
          context.result.diComment = queryModel;
          //set flag so this doesn't repeat for duplicate primary (should not happen)
          commentAdded = 1;
        }
      }
    }

    // accepts the destination and the model we need to query (model comes from dst-models-reference file)
    async function getModel(dest, model) {
      const { typeIdDst } = dest;

      return await model.findOne({
        raw: true,
        where: {
          id: typeIdDst,
        },
      });
    }

    return context;
  };
};

exports.applyFilter = function () {
  return async (context) => {
    const { filter, tenantId } = context.params.query;

    if (filter) {
      if (filter.length) {
        context.params.query = {
          ...context.params.query,
          $or: [
            { branch: { $like: `%${filter}%` } },
            { department: { $like: `%${filter}%` } },
            { namePrefix: { $like: `%${filter}%` } },
            { number: { $like: `%${filter}%` } },
          ],
        };

        if (!tenantId) {
          const tenants = await context.app.service('tenants')._find({
            paginate: false,
            query: {
              name: { $like: `%${filter}%` },
            },
          });

          if (tenants.length) {
            const tenantIds = tenants.map((tenant) => tenant.id);
            context.params.query.$or = [
              ...context.params.query.$or,
              { tenantId: { $in: tenantIds } },
            ];
          }
        }
      }
    }

    delete context.params.query.filter;

    return context;
  };
};

exports.numberOrdering = function () {
  return async (context) => {
    const userId = context.params.user.id;
    const { userRole, tenantIds } = context.params.user;
    const { tenantId, numbers, orderType, branch } = context.data;

    //check auth tenants for level 3 user first
    if (+userRole !== 1) {
      if (!tenantIds.includes(+tenantId)) {
        throw new Forbidden('You Do Not Have Permissions For This Tenant!');
      }
    }

    //get tenant record so we can get the appropriate name for caller id
    const TenantRecord = await context.app.service('tenants')._get(tenantId);

    if (!TenantRecord) {
      throw new Forbidden('This Tenant Does Not Exist!');
    }

    const tenantName = TenantRecord.name;
    const tenantCode = TenantRecord.tenantCode;
    let orderResponse = null;

    if (!orderType || orderType !== 'MANUAL') {
      const iqParams = await getIqParams(context.app);
      const accessToken = await iq_authenticate(iqParams);

      const orderData = {
        tenantId: tenantId,
        tenantName: tenantName.substr(0, 14),
        numbers: numbers,
        branch: branch,
        pon: tenantCode + '-' + userId,
      };

      //order numbers with our validated request
      orderResponse = await iq_tnOrder(orderData, accessToken, iqParams);
    }

    //create our new DIDS Entries
    //build the array of object for bulk create method
    const createData = [];
    for (let i = 0; i < numbers.length; i++) {
      if (
        (orderType === 'MANUAL' && !orderResponse) ||
        !orderResponse.numbers.includes(numbers[i])
      ) {
        let didObject = {
          tenantId: tenantId,
          number: numbers[i],
          diCommentName: tenantName,
        };
        Object.assign(didObject, didDefaults.DID);
        createData.push(didObject);
      }
    }

    if (!createData.length) {
      throw new BadRequest(
        'Order Was Not Completed. No Valid Numbers Provided ' +
          orderResponse.message
      );
    }

    context.data = createData;

    return context;
  };
};

exports.numberDeleteAuth = function () {
  return async (context) => {
    const { userRole, tenantIds } = context.params.user;
    const recordId = context.id;

    //get existing record
    const DidRecord = await context.app.service('dids')._get(recordId);

    if (DidRecord === null) {
      throw new Forbidden('This Phone Number Record Does Not Exist');
    }

    const { allowEmergency, number } = DidRecord;

    //message to use locations endpoint if this is an emergency location
    if (allowEmergency === 'on') {
      throw new Forbidden(
        'This Is an Emergency Number. Consult Locations Endpoint!'
      );
    }

    if (+userRole !== 1) {
      if (!tenantIds.includes(DidRecord.tenantId)) {
        throw new Forbidden('You Do Not Have Permissions for This Account!');
      }
    }

    //inteliquent functions
    const iqParams = await getIqParams(context.app);
    const accessToken = await iq_authenticate(iqParams);
    await iq_tnDisconnect(number, accessToken, iqParams);

    return context;
  };
};

exports.numberUpdateAuth = function () {
  return async (context) => {
    const recordId = context.id;
    const { userRole, tenantIds } = context.params.user;
    const { tenantId } = context.params.query;
    const { callerId, callerIdUpdated } = context.data;

    const DidRecord = await context.app.service('dids')._get(recordId);

    if (!DidRecord) {
      throw new BadRequest('This Record Does Not Exist!');
    }

    const { allowEmergency, number } = DidRecord;

    if (allowEmergency === 'on') {
      throw new Forbidden(
        'This Record Is An E911 Location. Refer to the Locations Service!'
      );
    }

    if (tenantId && userRole !== 1) {
      throw new Forbidden('You do not have permission to modify this number!');
    }

    if (+userRole !== 1) {
      if (!tenantIds.includes(DidRecord.tenantId)) {
        throw new Forbidden('You Do Not Have Permissions For This Tenant!');
      }
    }

    //fetch inteliquent api variables from db
    const iqParams = await getIqParams(context.app);

    //if all our auth passes we can move on to inteliquent query and actual update
    const accessToken = await iq_authenticate(iqParams);
    const updateData = {
      number,
      name: callerId,
    };

    //if we changed the callerid call inteliquent. otherwise no point.
    if (callerIdUpdated) {
      await iq_updateNumber(updateData, accessToken, iqParams);
    }

    return context;
  };
};

exports.validateCreate = function () {
  return validate.form(schema_CREATE, joiOptions);
};

exports.validateUpdate = function () {
  return validate.form(schema_UPDATE, joiOptions);
};
