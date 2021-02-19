const {authenticate} = require('@feathersjs/authentication').hooks;
const {iff, isProvider, disallow, fastJoin} = require('feathers-hooks-common');
const {roleToString, checkTenantId, verifyTenants} = require('../../global-hooks/global-hooks.auth');
const {checkForExtension} = require('./hooks');
const checkPermissions = require('feathers-permissions');

//resolvers
const {resolverFind} = require('./resolvers');

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      iff(isProvider('external'), roleToString()),
      checkPermissions({roles: ['1', '3', '5', '7'], entity: 'user', field: 'userRole'})
    ],
    find: [
      iff(isProvider('external'),
        checkTenantId(),
        checkForExtension(),
        verifyTenants()
      )
    ],
    get: [
      iff(isProvider('external'), checkTenantId()),
    ],
    create: [
      disallow('external', 'server')
    ],
    update: [
      disallow('external', 'server')
    ],
    patch: [
      disallow('external', 'server')
    ],
    remove: [
      disallow('external', 'server')
    ]
  },

  after: {
    all: [],
    find: [
      fastJoin(resolverFind)
    ],
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
