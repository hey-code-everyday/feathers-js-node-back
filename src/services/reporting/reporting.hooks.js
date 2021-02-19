const { disallow } = require('feathers-hooks-common');
const {checkNoAuthKey} = require('../../global-hooks/global-hooks.auth');

module.exports = {
  before: {
    all: [
      checkNoAuthKey()
    ],
    find: [],
    get: [ disallow('external') ],
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
