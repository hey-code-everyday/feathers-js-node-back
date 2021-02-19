const { authenticate } = require('@feathersjs/authentication').hooks;
const {iff, isProvider, fastJoin} = require('feathers-hooks-common');
const {roleToString} = require('../../global-hooks/global-hooks.auth');
const checkPermissions = require('feathers-permissions');

//resolvers
const {resolverGet} = require('./resolvers');

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      iff(isProvider('external'), roleToString()),
      checkPermissions({roles: [ '1' ], entity: 'user', field: 'userRole'})
    ],
    find: [],
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
      fastJoin(resolverGet)
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
