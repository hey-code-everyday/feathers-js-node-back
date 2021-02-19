const { authenticate } = require('@feathersjs/authentication').hooks;
const { roleToString, checkQueueId } = require('../../global-hooks/global-hooks.auth');
const { verifyQueueId } = require('./hooks');
const { iff, isProvider, fastJoin, disallow } = require('feathers-hooks-common');
const checkPermissions = require('feathers-permissions');

//resolvers
const { resolverFind } = require('./resolvers');

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      iff(isProvider('external'), roleToString()),
      checkPermissions({roles: ['1','3','7'], entity: 'user', field: 'userRole'})
    ],
    find: [
      iff(isProvider('external'),
        checkQueueId(),
        verifyQueueId()
      )
    ],
    get: [
      disallow('external', 'server')
    ],
    create: [
      disallow('external')
    ],
    update: [
      disallow('external', 'server')
    ],
    patch: [
      disallow('external', 'server')
    ],
    remove: [
      disallow('external')
    ]
  },

  after: {
    all: [],
    find: [
      fastJoin(resolverFind)
    ],
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
