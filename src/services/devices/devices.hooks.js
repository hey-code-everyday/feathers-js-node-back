const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff, isProvider, discard, fastJoin } = require('feathers-hooks-common');
const {
  roleToString,
  checkTenantId,
  verifyTenants,
  checkGetAuth,
} = require('../../global-hooks/global-hooks.auth');
const checkPermissions = require('feathers-permissions');

const { afterCreateDevice } = require('./hooks');

//resolvers
const { resolverFind, resolverGet } = require('./resolvers');

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
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [fastJoin(resolverFind), discard('ph_line1_ex_id', 'ph_pm_id')],
    get: [
      iff(isProvider('external'), checkGetAuth()),
      fastJoin(resolverGet),
      discard('ph_line1_ex_id', 'ph_pm_id'),
    ],
    create: [afterCreateDevice()],
    update: [],
    patch: [],
    remove: [],
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
