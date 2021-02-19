const {authenticate} = require('@feathersjs/authentication').hooks;
const {iff, isProvider, disallow, discardQuery, alterItems} = require('feathers-hooks-common');
const {roleToString, checkTenantId, verifyTenants} = require('../../global-hooks/global-hooks.auth');
const {tenantIdToCode} = require('../../global-hooks/global-hooks.mutate-params');
const {filterToExtension} = require('./hooks');
const checkPermissions = require('feathers-permissions');
const moment = require('moment');

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      iff(isProvider('external'), roleToString()),
      checkPermissions({roles: ['1', '3', '5', '7'], entity: 'user', field: 'userRole'})
    ],
    find: [
      iff(isProvider('external'),
        checkTenantId(),
        verifyTenants(),
        tenantIdToCode(),
      ),
      discardQuery('tenantId'),
      iff(isProvider('external'), filterToExtension())
    ],
    get: [
      iff(isProvider('external'),
        checkTenantId(),
        tenantIdToCode()
      ),
      discardQuery('tenantId'),
      iff(isProvider('external'), filterToExtension())
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
    all: [
      alterItems(record => {
        record.start = moment.utc(record.start).format('YYYY-MM-DD HH:mm:ss');
        record.answer = moment.utc(record.answer).format('YYYY-MM-DD HH:mm:ss');
        record.end = moment.utc(record.end).format('YYYY-MM-DD HH:mm:ss');
      }),
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
