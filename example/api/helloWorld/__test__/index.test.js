'use strict'

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const { testEnvs } = require('../../../__test__/testUtils')

const { setupFastify } = require('../../../app')

describe('Example', () => {
  it('calls the hello API', async() => {
    const fastify = await setupFastify(testEnvs)
    const response = await fastify.inject({
      method: 'GET',
      url: '/',
      headers: {
        miauserid: 'USER 1',
      },
    })

    assert.equal(
      response.statusCode,
      200,
      `The response code in not the one expected`
    )
    assert.deepEqual(
      JSON.parse(response.payload),
      { 'foo': fastify.envs.FOO, 'aa': 'vv', 'bb': [{ 'aa': 'aa' }], user: 'USER 1' },
      `The response body in not the one expected`
    )
  })
})


