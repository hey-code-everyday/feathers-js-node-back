const express = require('@feathersjs/express');
const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio');
// const {natsSyncAdapter} = require('./nats/nats-adapter');

const cors = require('cors');
const compress = require('compression');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const path = require('path');

const appHooks = require('./app.hooks');
const channels = require('./channels');
const logger = require('./logger');
const middleware = require('./middleware');
const sequelize = require('./sequelize');
const sequelizecdr = require('./sequelize_cdr');
const services = require('./services');
const authentication = require('./authentication');

process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '../config/');
const configuration = require('@feathersjs/configuration');
const app = express(feathers());

// Load app configuration
require('dotenv').config();
app.configure(configuration());

// Configure NATS Sync Adapter
// app.configure(natsSyncAdapter());

// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));

// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());

//configure socket io and logic for user offline status
const socketPort = +process.env.SOCKETPORT;
app.configure(
  socketio(
    socketPort,
    {
      transports: ['websocket'],
    },
    function (io) {
      io.sockets.setMaxListeners(100);
    }
  )
);

app.on('disconnect', (connection) => {
  if (connection.hasOwnProperty('user')) {
    const { id, email } = connection.user;
    console.log('::: THIS USER JUST DISCONNECTED :::');
    console.log('User ID: ' + id + ' User EMAIL: ' + email);
  }
});

app.configure(sequelize);
app.configure(sequelizecdr);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);

// Set up our services (see `services/index.js`)
app.configure(services);

// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));
app.hooks(appHooks);
module.exports = app;
