const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  iff,
  isProvider,
  disallow,
  keep,
  fastJoin,
} = require('feathers-hooks-common');
const {
  roleToString,
  checkTenantId,
  verifyTenants,
  checkGetAuth,
} = require('../../global-hooks/global-hooks.auth');
const {
  applyFilter,
  addDidDestinations,
  numberDeleteAuth,
  numberOrdering,
  numberUpdateAuth,
  validateCreate,
  validateUpdate,
} = require('./hooks');
const checkPermissions = require('feathers-permissions');

//resolvers
const { resolverFind, resolverGet } = require('./resolvers');

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      iff(isProvider('external'), roleToString()),
      checkPermissions({
        roles: ['1', '3'],
        entity: 'user',
        field: 'userRole',
      }),
    ],
    find: [
      iff(
        isProvider('external'),
        checkTenantId(),
        verifyTenants(),
        applyFilter()
      ),
    ],
    get: [],
    create: [iff(isProvider('external'), validateCreate(), numberOrdering())],
    update: [disallow('external', 'server')],
    patch: [iff(isProvider('external'), validateUpdate(), numberUpdateAuth())],
    remove: [iff(isProvider('external'), numberDeleteAuth())],
  },

  after: {
    all: [],
    find: [
      fastJoin(resolverFind),
      keep(
        'id',
        'number',
        'namePrefix',
        'recording',
        'fax',
        'allowEmergency',
        'tenantId',
        'branch',
        'department',
        'useStatus',
        'tenantName',
        'diCommentName'
      ),
    ],
    get: [
      iff(isProvider('external'), checkGetAuth()),
      fastJoin(resolverGet),
      keep(
        'id',
        'number',
        'namePrefix',
        'recording',
        'fax',
        'allowEmergency',
        'tenantId',
        'branch',
        'department',
        'useStatus',
        'de_destinations',
        'emergExtensions'
      ),
      addDidDestinations(),
    ],
    create: [fastJoin(resolverFind)],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
