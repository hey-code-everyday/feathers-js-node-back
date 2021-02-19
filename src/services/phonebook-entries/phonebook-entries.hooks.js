const { authenticate } = require('@feathersjs/authentication').hooks;
const {iff, isProvider, fastJoin} = require('feathers-hooks-common');
const {roleToString, checkTenantId} = require('../../global-hooks/global-hooks.auth');
const {
  loadPhonebookItems,
  createEntryDetails,
  updateEntryDetails,
  removeEntryDetails,
  queryNewlyInserted,
  checkPhonebookId
} = require('./hooks');
const checkPermissions = require('feathers-permissions');

//resolvers
const {resolverFind} = require('./resolvers');

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      iff(isProvider('external'), roleToString()),
      checkPermissions({roles: ['1','3','5','7'], entity: 'user', field: 'userRole'}),
      loadPhonebookItems()
    ],
    find: [
      iff(isProvider('external'),
        checkTenantId(),
        checkPhonebookId()
      )
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      context => {context.event = null}
    ],
    find: [
      fastJoin(resolverFind)
    ],
    get: [
      fastJoin(resolverFind)
    ],
    create: [
      queryNewlyInserted(),
      createEntryDetails(),
      fastJoin(resolverFind)
    ],
    update: [],
    patch: [
      updateEntryDetails(),
      fastJoin(resolverFind),
    ],
    remove: [
      removeEntryDetails()
    ]
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
