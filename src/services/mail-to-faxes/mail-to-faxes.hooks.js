const { authenticate } = require('@feathersjs/authentication').hooks;
const {iff, isProvider, disallow} = require('feathers-hooks-common');
const {roleToString, checkTenantId, verifyTenants} = require('../../global-hooks/global-hooks.auth');
const checkPermissions = require('feathers-permissions');

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      iff(isProvider('external'), roleToString()),
      checkPermissions({roles: ['1','3','5','7'], entity: 'user', field: 'userRole'})
    ],
    find: [
      iff(isProvider('external'),
        checkTenantId(),
        verifyTenants()
      )
    ],
    get: [
      disallow('server', 'external')
    ],
    create: [
      disallow('server', 'external')
    ],
    update: [
      disallow('server', 'external')
    ],
    patch: [
      disallow('server', 'external')
    ],
    remove: [
      disallow('server', 'external')
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
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
