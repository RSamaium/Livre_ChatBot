const request = require('supertest')
const assert = require('assert')
const app = require('../src/server/app')
const config = require('../src/config')

describe('Webhook Spec', function () {

  it('Messenger Test', () => {
    const { webhookToken } = config.platforms.messenger
    return request(app)
      .get(`/facebook/webhook?hub.verify_token=${webhookToken}&hub.challenge=ok`)
      .expect(200)
      .then(res => {
        assert.equal(res.text, 'ok')
      })
  })

  it('Fake webhook token', () => {
    return request(app)
      .get(`/facebook/webhook?hub.verify_token=fake&hub.challenge=ok`)
      .expect(403)
  })

})
