const NATS = require('nats');
const {core} = require('feathers-sync');
const config = require('./config');

const {natsOptions, deserialize, serialize} = config
const natsClient = NATS.connect(natsOptions);

exports.natsClient = natsClient;

exports.natsSyncAdapter = () => {
  return app => {
    const key = 'feathers-sync';
    const pub = natsClient;
    const sub = natsClient;

    app.configure(core);
    app.sync = {
      deserialize,
      serialize,
      pub,
      sub,
      type: 'nats',
      ready: new Promise((resolve, reject) => {
        sub.once('connect', resolve);
        sub.once('error', reject);
      })
    };

    app.on('sync-out', data => {
      pub.publish(key, data);
    });

    sub.subscribe(key, data => {
      // console.log(data);
      app.emit('sync-in', data);
    });

  };
}
