/* eslint-disable no-unused-vars */
exports.PasswordReset = class PasswordReset {
  constructor (options) {
    this.options = options || {};
  }

  setup(app){
    this.app = app;
  }

  async find (params) {
    return [];
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    const userId = params.user.id;
    const {password} = data;
    this.app.service('users').patch(userId, {password});
    return 'Password Successfully Reset';
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
};
