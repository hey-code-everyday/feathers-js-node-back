const checkNumber = require('./modules/check-query');

class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    const { number, mac } = params.query;

    if (number) {
      const numberStatus = await checkNumber(params, this.app);

      return {
        msg: 'Number Check Successful',
        inUse: numberStatus,
      };
    } else if (mac) {
      const macStatus = await checkNumber(params, this.app);

      return {
        msg: 'Mac address Check Successful',
        inUse: macStatus,
      };
    }
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return data;
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
