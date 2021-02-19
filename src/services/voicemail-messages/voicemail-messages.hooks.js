const { authenticate } = require('@feathersjs/authentication').hooks;
const {iff, isProvider, disallow, fastJoin, discard} = require('feathers-hooks-common');
const {roleToString} = require('../../global-hooks/global-hooks.auth');
const {checkVMGetAuth, addRecording} = require('./hooks');
const checkPermissions = require('feathers-permissions');

//resolvers
const {resolverGet} = require('./resolvers');

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      iff(isProvider('external'), roleToString()),
      checkPermissions({roles: ['1','3','5','7'], entity: 'user', field: 'userRole'})
    ],
    find: [
      disallow('external')
    ],
    get: [
      addRecording()
    ],
    create: [
      disallow('external')
    ],
    update: [
      disallow('external')
    ],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      discard( 'mailboxuser', 'msgId')
    ],
    get: [
      fastJoin(resolverGet),
      iff(isProvider('external'), checkVMGetAuth())
    ],
    create: [],
    update: [],
    patch: [
      context => {context.event = null;}
    ],
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
