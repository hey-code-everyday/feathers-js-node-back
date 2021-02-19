const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  iff,
  isProvider,
  fastJoin,
  discard,
  disallow,
} = require('feathers-hooks-common');
const {
  checkTenantId,
  roleToString,
  verifyTenants,
} = require('../../global-hooks/global-hooks.auth');
const {
  afterGetExt,
  beforeCreateExt,
  afterCreateExt,
  beforePatchExt,
  afterDeleteExt,
  validateCreate,
  validatePatch,
  checkGetAuth,
} = require('./hooks');
const checkPermissions = require('feathers-permissions');

//resolver
const { resolverFind, resolverGet } = require('./resolvers');

module.exports = {
  before: {
    all: [authenticate('jwt'), iff(isProvider('external'), roleToString())],
    find: [
      checkPermissions({
        roles: ['1', '3', '5', '7'],
        entity: 'user',
        field: 'userRole',
      }),
      iff(isProvider('external'), checkTenantId(), verifyTenants()),
    ],
    get: [
      checkPermissions({
        roles: ['1', '3', '5', '7'],
        entity: 'user',
        field: 'userRole',
      }),
    ],
    create: [
      checkPermissions({
        roles: ['1', '3'],
        entity: 'user',
        field: 'userRole',
      }),
      iff(isProvider('external'), validateCreate(), beforeCreateExt()),
    ],
    update: [disallow('server', 'external')],
    patch: [
      checkPermissions({
        roles: ['1', '3', '5', '7'],
        entity: 'user',
        field: 'userRole',
      }),
      validatePatch(),
      beforePatchExt(),
    ],
    remove: [
      checkPermissions({
        roles: ['1', '3'],
        entity: 'user',
        field: 'userRole',
      }),
    ],
  },

  after: {
    all: [],
    find: [
      fastJoin(resolverFind),
      //just some placeholder junk to slim down response.
      discard(
        'blockcid',
        'callGroup',
        'cidUsage',
        'crid',
        'dialTimeout',
        'emailRecording',
        'faxGateway',
        'fmfmCallerId',
        'fmfmConfirmMessageId',
        'fmfmDialMethod',
        'fmfmDialTimeout',
        'fmfmHoldMessageId',
        'fmfmNamePrefix',
        'fmfmNumber',
        'fmfmStatus',
        'includeInPb',
        'maxDigitPrefix',
        'minDigitPrefix',
        'mineMailRecording',
        'onBusyStatus',
        'onNoAnswerStatus',
        'onOfflineStatus',
        'pickupGroup',
        'trunkCidOverride',
        'trunkCidSource',
        'trunkEmergencyCidOverride'
      ),
    ],
    get: [
      iff(isProvider('external'), checkGetAuth()),
      fastJoin(resolverGet),
      afterGetExt(),
    ],
    create: [afterCreateExt()],
    update: [],
    patch: [fastJoin(resolverFind)],
    remove: [afterDeleteExt()],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
