const { authenticate } = require('@feathersjs/authentication').hooks;
const {iff, isProvider, disallow} = require('feathers-hooks-common');
const {roleToString} = require('../../global-hooks/global-hooks.auth');
const {validateCreate} = require('./hooks');
const checkPermissions = require('feathers-permissions');


module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      iff(isProvider('external'), roleToString()),
      checkPermissions({roles: ['1', '3','5','7'], entity: 'user', field: 'userRole'}),
    ],
    find: [
      disallow('external', 'server')
    ],
    get: [
      disallow('external', 'server')
    ],
    create: [
      iff(isProvider('external'), validateCreate())
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
