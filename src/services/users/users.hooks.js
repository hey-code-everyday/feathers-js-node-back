const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  hashPassword,
  protect,
} = require('@feathersjs/authentication-local').hooks;
const {
  disallow,
  fastJoin,
  iff,
  isProvider,
} = require('feathers-hooks-common');
const {
  roleToString,
  checkTenantId,
  verifyTenants,
} = require('../../global-hooks/global-hooks.auth');
const checkPermissions = require('feathers-permissions');
const {
  applyFilter,
  generatePassword,
  updateExtension,
  updateQueues,
  updateTenants,
  userCreateAuth,
  userDeleteAuth,
  userFindAuth,
  userGetAuth,
  userUpdateAuth,
  validateCreate,
  validateUpdate,
  welcomeEmail,
} = require('./hooks');

//resolvers
const { resolverFind, resolverGet } = require('./resolvers');

module.exports = {
  before: {
    all: [iff(isProvider('external'), authenticate('jwt'), roleToString())],
    find: [
      iff(
        isProvider('external'),
        checkTenantId(),
        userFindAuth(),
        applyFilter()
      ),
    ],
    get: [],
    create: [
      checkPermissions({
        roles: ['1', '3'],
        entity: 'user',
        field: 'userRole',
      }),
      iff(isProvider('external'), validateCreate(), userCreateAuth()),
      generatePassword(),
      hashPassword('password'),
    ],
    update: [disallow('external', 'server')],
    patch: [
      checkPermissions({
        roles: ['1', '3', '5', '7'],
        entity: 'user',
        field: 'userRole',
      }),
      generatePassword(),
      iff(isProvider('external'), validateUpdate(), userUpdateAuth()),
      hashPassword('password'),
    ],
    remove: [
      checkPermissions({
        roles: ['1', '3'],
        entity: 'user',
        field: 'userRole',
      }),
      iff(isProvider('external'), userDeleteAuth()),
    ],
  },

  after: {
    all: [protect('password')],
    find: [fastJoin(resolverFind)],
    get: [
      iff(isProvider('external'), fastJoin(resolverGet), userGetAuth()),
      fastJoin(resolverFind),
    ],
    create: [
      updateTenants(),
      updateExtension(),
      updateQueues(),
      fastJoin(resolverFind),
      welcomeEmail(),
    ],
    update: [],
    patch: [
      updateTenants(),
      updateExtension(),
      updateQueues(),
      fastJoin(resolverFind),
      welcomeEmail(),
    ],
    remove: [updateTenants(), updateExtension(), updateQueues()],
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
