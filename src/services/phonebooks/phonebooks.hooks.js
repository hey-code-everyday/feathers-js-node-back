const { authenticate } = require('@feathersjs/authentication').hooks;
const {disallow} = require('feathers-hooks-common');
const {addPhonebookToDevices, createPhonebookLayout, emitUserUpdate} = require('./hooks');

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
    ],
    find: [
      disallow('external')
    ],
    get: [
      disallow('external')
    ],
    create: [],
    update: [
      disallow('external')
    ],
    patch: [
      disallow('external')
    ],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      addPhonebookToDevices(),
      createPhonebookLayout(),
      emitUserUpdate()
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
