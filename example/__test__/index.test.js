'use strict'

const { describe, it, before } = require('node:test')
const assert = require('node:assert/strict')
const { testEnvs, loadTestEnvs } = require('./testUtils')

const { setupFastify } = require('../server')

describe('Example', () => {
  before(async() => {
    loadTestEnvs()
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
      { 'foo': testEnvs.FOO, 'aa': 'vv', 'bb': [{ 'aa': 'aa' }] },
      `The response body in not the one expected`
    )
  })
})


