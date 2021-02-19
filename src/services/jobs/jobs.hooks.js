const {checkNoAuthKey} = require('../../global-hooks/global-hooks.auth');
const {disallow} = require('feathers-hooks-common');

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
      checkNoAuthKey()
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
    all: [
      context => {context.event = null;}
    ],
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
