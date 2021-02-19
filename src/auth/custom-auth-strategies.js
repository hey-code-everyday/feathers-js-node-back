const { NotAuthenticated } = require('@feathersjs/errors');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const crypto = require('crypto');
const get = require('lodash/get');

exports.CustomLocalStrategy = class CustomLocalStrategy extends LocalStrategy {

  async comparePassword (entity, password) {

    const { entityPasswordField, errorMessage } = this.configuration;
    const hash = get(entity, entityPasswordField);

    if (!hash) {
      throw new NotAuthenticated(errorMessage);
    }

    const hashedPass = await this.hashPassword(password);

    const result = hashedPass.toUpperCase() === hash.toUpperCase();

    if (result) {
      return entity;
    }

    throw new NotAuthenticated(errorMessage);
  }

  async hashPassword (password, _params) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

}
