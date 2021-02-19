const { authenticate } = require('@feathersjs/authentication').hooks;
const {iff, isProvider, disallow} = require('feathers-hooks-common');
const {roleToString} = require('../../global-hooks/global-hooks.auth');
const checkPermissions = require('feathers-permissions');

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      iff(isProvider('external'), roleToString()),
      checkPermissions({roles: ['1','3'], entity: 'user', field: 'userRole'})
    ],
    find: [],
    get: [ disallow('external' )],
    create: [ disallow('external') ],
    update: [ disallow('external') ],
    patch: [ disallow('external') ],
    remove: [ disallow('external') ]
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
