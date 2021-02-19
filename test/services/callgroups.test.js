const assert = require('assert');
const app = require('../../src/app');

describe('\'callgroups\' service', () => {
  it('registered the service', () => {
    const service = app.service('callgroups');

    assert.ok(service, 'Registered the service');
  });
});
