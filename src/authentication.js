const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
const { expressOauth } = require('@feathersjs/authentication-oauth');
const { CustomLocalStrategy } = require('./auth/custom-auth-strategies');


module.exports = app => {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new CustomLocalStrategy());

  app.use('/authentication', authentication);
  app.configure(expressOauth());
};
