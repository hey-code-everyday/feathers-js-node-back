const { authenticate } = require('@feathersjs/authentication').hooks;
const {iff, isProvider, disallow} = require('feathers-hooks-common');
const {roleToString} = require('../../global-hooks/global-hooks.auth');
const {validateOrderViewAuth, getPortOrderAuth} = require('./hooks');
const checkPermissions = require('feathers-permissions');

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      iff(isProvider('external'), roleToString()),
      checkPermissions({roles: ['1', '3'], entity: 'user', field: 'userRole'}),
    ],
    find: [
      validateOrderViewAuth()
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
    find: [],
    get: [
      getPortOrderAuth()
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
