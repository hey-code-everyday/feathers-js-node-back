const {authenticate} = require('@feathersjs/authentication').hooks;
const {iff, isProvider, disallow, discard} = require('feathers-hooks-common');
const {roleToString, checkTenantId, verifyTenants} = require('../../global-hooks/global-hooks.auth');
const {forceBasicUserParams, addIncomingFaxes, fetchFaxFile} = require('./hooks');
const checkPermissions = require('feathers-permissions');


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
        verifyTenants(),
        forceBasicUserParams()
      )
    ],
    get: [],
    create: [
      disallow('external')
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      discard('file'),
      addIncomingFaxes()
    ],
    get: [
      iff(isProvider('external'), fetchFaxFile())
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
