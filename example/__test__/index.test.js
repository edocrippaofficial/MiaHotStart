'use strict'

const { describe, it, before } = require('node:test')
const assert = require('node:assert/strict')

const { setupFastify } = require('../server')

describe('Example', () => {
  const customEnvs = {
    FOO: 'BAR',
    HTTP_PORT: 3000,
  }

  before(async() => {
    process.env = {
      ...process.env,
      ...customEnvs,
    }
  })

  it('should start the server', async() => {
    const fastify = await setupFastify()
    const response = await fastify.inject({
      method: 'GET',
      url: '/',
    })

    assert.equal(
      response.statusCode,
      200,
      `The response code in not the one expected`
    )
    assert.deepEqual(
      JSON.parse(response.payload),
      { 'foo': customEnvs.FOO, 'aa': 'vv', 'bb': [{ 'aa': 'aa' }] },
      `The response body in not the one expected`
    )
  })
})


