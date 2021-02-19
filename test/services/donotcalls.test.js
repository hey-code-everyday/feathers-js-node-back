const assert = require('assert');
const app = require('../../src/app');

describe('\'donotcalls\' service', () => {
  it('registered the service', () => {
    const service = app.service('donotcalls');

    assert.ok(service, 'Registered the service');
  });
});
