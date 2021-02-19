const sgMail = require('@sendgrid/mail');
const generator = require('generate-password');
const emailTemplate = require('./emails/forgot-password-template');
const {BadRequest} = require('@feathersjs/errors');

/* eslint-disable no-unused-vars */
exports.ForgotPassword = class ForgotPassword {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
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

    const {email} = data;

    const userRecord = await this.app.service('users')._find({paginate: false, query: {email}});

    //if user record is found
    if(userRecord.length){
      const user = userRecord[0];

      //create link token
      const token = generator.generate({
        length: 30,
        numbers: true,
        uppercase: true,
      });

      //patch user w/ reset token
      await this.app.service('users')._patch(user.id, {resetToken: token});

      //create email
      const html = await emailTemplate(token, email);

      //blast email
      const settingsService = this.app.service('tenant-settings');
      const settings = await settingsService._find({paginate: false, query: {code: 'SENDGRIDAPIKEY'}});
      const sgApiKey = settings[0].value;

      sgMail.setApiKey(sgApiKey);
      const msg = {
        to: email,
        from: 'noreply@voxo.co',
        subject: 'Your VOXO Portal Password Reset',
        html: html
      };
      sgMail.send(msg);

    }

    return data;
  }

  async update (id, data, params) {

    //accept token, email, new password
    const {token, email, password} = data;

    //verify user against token
    const userRecord = await this.app.service('users')._find({paginate: false, query: {email, resetToken: token}});

    if(userRecord.length){
      const user = userRecord[0];
      //patch the new password in
      await this.app.service('users').patch(user.id, {password, resetToken: null});
    } else{
      throw new BadRequest('An Error Occurred. Password Cannot Be Reset.');
    }

    return 'Password Successfully Reset';
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
};
