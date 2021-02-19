const AWS = require('aws-sdk');
const { BadRequest } = require('@feathersjs/errors');
const imagemin = require('imagemin');
const generator = require('generate-password');
const fs = require('fs');


/* eslint-disable no-unused-vars */
exports.BucketUploadHandler = class BucketUploadHandler {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create(data, params) {

    const userId = params.user.id;
    const {email, avatarPath, avatarFileName} = params.user;
    const {files} = params;
    if(!files.length){
      throw new BadRequest('You did not provide a file');
    }

    //grab s3 settings
    const {APPFILESDIR, APPFILESHOST, APPFILESPASSWORD, APPFILESUSER} = await this.getS3Settings();
    const s3 = new AWS.S3({
      region: APPFILESHOST,
      accessKeyId: APPFILESUSER,
      secretAccessKey: APPFILESPASSWORD
    });

    //make sure bucket exists and if not create
    const convertedFiles = await imagemin([files[0].path], {
      destination: '/tmp/avatar-tmp'
    });
    const fileHash= generator.generate({
      length: 16,
      numbers: true,
      uppercase: true,
    });
    const fileExtension = files[0].fieldname.split('.')[1];
    const fileName = `${fileHash}.${fileExtension}`;
    const publicFilePath = `https://${APPFILESDIR}.s3.amazonaws.com/avatars/${fileName}`;

    try {
      await s3.putObject({
        Bucket: APPFILESDIR,
        Key: `avatars/${fileName}`,
        Body: convertedFiles[0].data
      }).promise();
    } catch (e) {
      throw new BadRequest(e);
    }

    //patch the user please
    await this.app.service('users').patch(userId, {avatarFileName: fileName, avatarPath: publicFilePath});
    this.app.service('users').emit('userAvatarUpdate', {userId, avatarFileName: fileName, avatarPath: publicFilePath});
    const extension = await this.app.service('extensions')._find({
      paginate: false,
      query: {
        email
      }
    });
    if(extension.length){
      this.app.service('extensions').emit('patched', {id: extension[0].id, avatarPath: publicFilePath});
    }

    //if user had an avatarPath, let's bust that old bucket object
    if(avatarPath){
      await s3.deleteObject({
        Bucket: APPFILESDIR,
        Key: `avatars/${avatarFileName}`
      }).promise();
    }

    //remove the old files.
    fs.unlink(files[0].path, function () {
      console.log('removed original avatar upload');
    });

    return data;
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {

    const userId = params.user.id;
    const {email} = params.user;
    const {fileName} = params.query;

    await this.app.service('users').patch(userId, {avatarFileName: null, avatarPath: null});
    this.app.service('users').emit('userAvatarUpdate', {userId, avatarFileName: null, avatarPath: null});
    const extension = await this.app.service('extensions')._find({
      paginate: false,
      query: {
        email
      }
    });
    if(extension.length){
      this.app.service('extensions').emit('patched', {id: extension[0].id, avatarPath: null});
    }

    const {APPFILESDIR, APPFILESHOST, APPFILESPASSWORD, APPFILESUSER} = await this.getS3Settings();
    const s3 = new AWS.S3({
      region: APPFILESHOST,
      accessKeyId: APPFILESUSER,
      secretAccessKey: APPFILESPASSWORD
    });

    await s3.deleteObject({
      Bucket: APPFILESDIR,
      Key: `avatars/${fileName}`
    }).promise();

    return 'Successful Avatar Delete';
  }

  async getS3Settings () {

    const settingsArray = {};
    const settingsS3 = await this.app.service('tenant-settings')._find({
      paginate: false,
      query: {
        code: {$in: ['APPFILESDIR', 'APPFILESPASSWORD', 'APPFILESUSER', 'APPFILESHOST']}
      }
    });

    for(let i = 0; i<settingsS3.length; i++){
      settingsArray[settingsS3[i].code] = settingsS3[i].value;
    }

    return settingsArray;
  }

};
