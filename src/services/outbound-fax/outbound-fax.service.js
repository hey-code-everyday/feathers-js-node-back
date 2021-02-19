// Initializes the `outbound-fax` service on path `/outbound-fax`
const { OutboundFax } = require('./outbound-fax.class');
const hooks = require('./outbound-fax.hooks');
const emailParse = require('../../middleware/sendgrid-inbound-parse');
const multer = require('multer');
const upload = multer({dest: '/tmp'});

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/outbound-fax', upload.any(), (req, res, next) => {
    if(req.query.hasOwnProperty('noAuth')){
      req.feathers.emailParse = {...emailParse(req), files: req.files};
      next();
    } else{
      req.feathers.files = req.files;
      next();
    }
  }, new OutboundFax(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('outbound-fax');

  service.hooks(hooks);
};
