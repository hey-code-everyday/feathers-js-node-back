const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff, isProvider, keep, fastJoin } = require('feathers-hooks-common');
const {
  roleToString,
  checkTenantId,
  verifyTenants,
  checkGetAuth,
} = require('../../global-hooks/global-hooks.auth');
const { addDidDestinations } = require('../dids/hooks');
const {
  forceEmergencyOn,
  provisionLocation,
  locationUpdateAuth,
  locationDeleteAuth,
  validateUpdate,
  validateCreate,
} = require('./hooks');
const checkPermissions = require('feathers-permissions');

//resolvers
const { resolverGet } = require('../dids/resolvers');

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
      iff(isProvider('external'), checkTenantId(), verifyTenants()),
      forceEmergencyOn(),
    ],
    get: [],
    create: [
      iff(isProvider('external'), validateCreate()),
      provisionLocation(),
    ],
    update: [],
    patch: [
      iff(isProvider('external'), validateUpdate()),
      locationUpdateAuth(),
    ],
    remove: [locationDeleteAuth()],
  },

  after: {
    all: [],
    find: [
      keep(
        'id',
        'diCommentName',
        'emergencyNotes',
        'namePrefix',
        'recording',
        'fax',
        'allowEmergency',
        'tenantId',
        'branch',
        'department',
        'number'
      ),
    ],
    get: [
      iff(isProvider('external'), checkGetAuth()),
      fastJoin(resolverGet),
      keep(
        'id',
        'number',
        'diCommentName',
        'emergencyNotes',
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
    create: [],
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
