const { authenticate } = require('@feathersjs/authentication').hooks;
const {iff, isProvider, fastJoin, disallow} = require('feathers-hooks-common');
const {roleToString} = require('../../global-hooks/global-hooks.auth');
const {
  tenantFindAuth,
  tenantGetAuth,
  addTenantDefaults,
  tenantUpdateAuth,
  createTenantRelations,
  removeTenantPivots,
  validateCreate,
  validateUpdate
} = require('./hooks');
const checkPermissions = require('feathers-permissions');

//resolvers
const {resolverGet} = require('./resolvers');

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      iff(isProvider('external'), roleToString())
    ],
    find: [
      checkPermissions({roles: ['1','3','5','7'], entity: 'user', field: 'userRole'}),
      iff(isProvider('external'), tenantFindAuth())
    ],
    get: [
      checkPermissions({roles: ['1','3'], entity: 'user', field: 'userRole'}),
      iff(isProvider('external'), tenantGetAuth())
    ],
    create: [
      checkPermissions({roles: ['1', '3'], entity: 'user', field: 'userRole'}),
      validateCreate(),
      addTenantDefaults()
    ],
    update: [
      disallow('external', 'server')
    ],
    patch: [
      checkPermissions({roles: ['1', '3'], entity: 'user', field: 'userRole'}),
      iff(isProvider('external'), tenantUpdateAuth()),
      validateUpdate()
    ],
    remove: [
      checkPermissions({roles: ['1'], entity: 'user', field: 'userRole'}),
    ]
  },

  after: {
    all: [],
    find: [],
    get: [
      fastJoin(resolverGet)
    ],
    create: [
      createTenantRelations()
    ],
    update: [],
    patch: [],
    remove: [
      removeTenantPivots()
    ]
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
