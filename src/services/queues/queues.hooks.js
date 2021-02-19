const checkPermissions = require('feathers-permissions');

const { authenticate } = require('@feathersjs/authentication').hooks;
const {iff, isProvider} = require('feathers-hooks-common');
const { verifyTenants, checkTenantId, roleToString, checkGetAuth } = require('../../global-hooks/global-hooks.auth');

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
