const { authenticate } = require('@feathersjs/authentication').hooks;
const {iff, isProvider, disallow} = require('feathers-hooks-common');
const {roleToString, checkQueueId, checkQueueAuth} = require('../../global-hooks/global-hooks.auth');
const checkPermissions = require('feathers-permissions');


module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      iff(
        isProvider('external'),
        roleToString(),
        checkPermissions({roles: ['1','3','5','7'], entity: 'user', field: 'userRole'})
      ),
    ],
    find: [
      iff(isProvider('external'),
        checkQueueId(),
        checkQueueAuth()
      )
    ],
    get: [
      disallow('external', 'server')
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
