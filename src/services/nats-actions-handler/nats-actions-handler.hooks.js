const { authenticate } = require('@feathersjs/authentication').hooks;
const {isNoAuthRequest, checkNoAuthKey} = require('../../global-hooks/global-hooks.auth');
const {disallow, iffElse, iff, isProvider} = require('feathers-hooks-common');


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
          )
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
      context => {context.event = null;}
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
