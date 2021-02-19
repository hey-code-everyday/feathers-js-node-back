require('dotenv').config();

module.exports = {
  serialize: JSON.stringify,
  deserialize: JSON.parse,
  natsOptions: {
    servers: process.env.NATSSERVERS.split(','),
    token: process.env.NATSTOKEN
  }
}
