const { authenticate } = require('@feathersjs/authentication').hooks;
const checkPermissions = require('feathers-permissions');
const {iff, isProvider, fastJoin} = require('feathers-hooks-common');
const {roleToString, checkTenantId, verifyTenants, checkGetAuth} = require('../../global-hooks/global-hooks.auth');
const {beforeCreateSipfriend} = require('./hooks');

//resolvers
const {sipfriendResolvers} = require('./resolvers');


module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      iff(isProvider('external'), roleToString()),
      checkPermissions({roles: ['1', '3'], entity: 'user', field: 'userRole'}),
    ],
    find: [
      iff(isProvider('external'),
        checkTenantId(),
        verifyTenants()
      )
    ],
    get: [],
    create: [
      beforeCreateSipfriend()
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      fastJoin(sipfriendResolvers)
    ],
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
