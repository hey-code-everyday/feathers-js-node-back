const { authenticate } = require('@feathersjs/authentication').hooks;
const {iff, iffElse, isProvider, disallow} = require('feathers-hooks-common');
const {roleToString, isNoAuthRequest, checkNoAuthKey} = require('../../global-hooks/global-hooks.auth');
const checkPermissions = require('feathers-permissions');

module.exports = {
  before: {
    all: [],
    find: [
      disallow('external', 'server')
    ],
    get: [
      disallow('external', 'server')
    ],
    create: [
      iffElse( isNoAuthRequest(),
        [checkNoAuthKey()],
        [
          iff(isProvider('external'),
            authenticate('jwt'),
            roleToString(),
            checkPermissions({roles: ['1','3','5','7'], entity: 'user', field: 'userRole'}),
          ),
        ]),
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
    create: [
      context => {context.event = null}
    ],
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
