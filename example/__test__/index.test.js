'use strict'

const { describe, it, before, after } = require('node:test')
const assert = require('node:assert/strict')

const { setupFastify } = require('../server')

describe('Example', () => {
  const customEnvs = {
    FOO: 'BAR',
  }

  let originalEnvs
  before(async() => {
    originalEnvs = JSON.stringify(process.env)
    process.env = {
      ...process.env,
      ...customEnvs,
    }
  })
  after(async() => {
    process.env = JSON.parse(originalEnvs)
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
      { hello: customEnvs.FOO },
      `The response body in not the one expected`
    )
  })
})


