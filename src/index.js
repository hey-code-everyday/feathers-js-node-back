/* eslint-disable no-console */
const logger = require('./logger');
const app = require('./app');
const port = app.get('port');
const server = app.listen(port);
const natsAction = require('./nats/nats-api-actions');

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info(process.env.GREETINGS + ' Feathers application started on http://%s:%d', app.get('host'), port)
);

natsAction();
