const assert = require('assert');
const app = require('../../src/app');

describe('\'pickupgroups\' service', () => {
  it('registered the service', () => {
    const service = app.service('pickupgroups');

    assert.ok(service, 'Registered the service');
  });
});
