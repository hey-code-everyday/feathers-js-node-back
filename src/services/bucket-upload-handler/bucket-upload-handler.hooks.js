const { authenticate } = require('@feathersjs/authentication').hooks;
const {iff, isProvider, disallow} = require('feathers-hooks-common');
const {roleToString} = require('../../global-hooks/global-hooks.auth');
const checkPermissions = require('feathers-permissions');

module.exports = {
  before: {
    all: [
      authenticate('jwt') ,
      iff(isProvider('external'), roleToString()),
      checkPermissions({roles: ['1','3','5','7'], entity: 'user', field: 'userRole'})
    ],
    find: [
      disallow('external')
    ],
    get: [
      disallow('external')
    ],
    create: [],
    update: [
      disallow('external')
    ],
    patch: [
      disallow('external')
    ],
    remove: []
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
