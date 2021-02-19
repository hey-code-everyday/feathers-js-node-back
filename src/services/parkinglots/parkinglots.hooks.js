const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff, isProvider } = require('feathers-hooks-common');
const {roleToString, checkTenantId, verifyTenants, checkGetAuth} = require('../../global-hooks/global-hooks.auth');
const checkPermissions = require('feathers-permissions');

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      iff(isProvider('external'), roleToString()),
      checkPermissions({roles: ['1','3'], entity: 'user', field: 'userRole'})
    ],
    find: [
      iff(isProvider('external'),
        checkTenantId(),
        verifyTenants()
      )
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [
      iff(isProvider('external'), checkGetAuth())
    ],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
