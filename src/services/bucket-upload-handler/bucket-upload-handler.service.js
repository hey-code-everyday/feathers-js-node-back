// Initializes the `bucket-upload-handler` service on path `/bucket-upload-handler`
const { BucketUploadHandler } = require('./bucket-upload-handler.class');
const hooks = require('./bucket-upload-handler.hooks');
const multer = require('multer');
const upload = multer({dest: '/tmp/avatar-tmp'});


module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/bucket-upload-handler', upload.any(), (req, res, next) => {
    req.feathers.files = req.files;
    next();
  }, new BucketUploadHandler(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('bucket-upload-handler');

  service.hooks(hooks);
};
