const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff, isProvider, fastJoin } = require('feathers-hooks-common');
const {
  roleToString,
  checkTenantId,
  verifyTenants,
} = require('../../global-hooks/global-hooks.auth');
const { addDestinations } = require('../destinations/hooks');
const { voicemailGetAuth } = require('./hooks');
const checkPermissions = require('feathers-permissions');

//resolvers
const { resolverGet } = require('./resolvers');

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      iff(isProvider('external'), roleToString()),
      checkPermissions({
        roles: ['1', '3', '5', '7'],
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
    find: [],
    get: [
      iff(isProvider('external'), voicemailGetAuth()),
      fastJoin(resolverGet),
      addDestinations(),
    ],
    create: [],
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
