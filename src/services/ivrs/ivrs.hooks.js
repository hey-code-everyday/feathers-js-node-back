const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff, isProvider, fastJoin } = require('feathers-hooks-common');
const {
  roleToString,
  checkTenantId,
  verifyTenants,
  checkGetAuth,
} = require('../../global-hooks/global-hooks.auth');
const { addDestinations } = require('../destinations/hooks');
const checkPermissions = require('feathers-permissions');

//resolvers
const { resolverGet } = require('./resolvers');

const {
  beforeCreateIvr,
  afterCreateIvr,
  afterGetIvr,
  beforePatchIvr,
  afterDeleteIvr,
  validateCreate,
  validatePatch,
} = require('./hooks');

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      iff(isProvider('external'), roleToString()),
      checkPermissions({
        roles: ['1', '3'],
        entity: 'user',
        field: 'userRole',
      }),
    ],
    find: [iff(isProvider('external'), checkTenantId(), verifyTenants())],
    get: [],
    create: [validateCreate(), beforeCreateIvr()],
    update: [],
    patch: [validatePatch(), beforePatchIvr()],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [
      iff(isProvider('external'), checkGetAuth()),
      fastJoin(resolverGet),
      addDestinations(),
      afterGetIvr(),
    ],
    create: [afterCreateIvr()],
    update: [],
    patch: [],
    remove: [afterDeleteIvr()],
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
