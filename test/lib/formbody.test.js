'use strict'

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')

const formAutoContent = require('form-auto-content')

const fastify = require('fastify')
const fastifyMia = require('../../src')

async function setupFastify({ disableFormBody = false } = {}) {
  const server = fastify()
  server.register(fastifyMia, {
    envSchema: { type: 'object' },
    disableFormBody,
  })

  server.post('/', async(request, reply) => {
    reply.send('ok')
  })

  return server
}

describe('Fastify FormBody', () => {
  it('has correctly registered the plugin', async() => {
    const fastifyInstance = await setupFastify()
    assert.ok(fastifyInstance.hasPlugin('@fastify/formbody'), `The plugin @fastify/formbody is not registered correctly`)
  })

  it('handles correctly an `application/x-www-form-urlencoded` request', async() => {
    const fastifyInstance = await setupFastify()

    const response = await fastifyInstance.inject({
      method: 'POST',
      url: '/',
      ...formAutoContent({ foo: ['bar', 'baz'] }),
    })

    assert.equal(response.statusCode, 200, `The response status code is not 200`)
  })

  it('has correctly skipped the plugin if the option `disableFormBody` is true', async() => {
    const fastifyInstance = await setupFastify({
      disableFormBody: true,
    })

    const response = await fastifyInstance.inject({
      method: 'POST',
      url: '/',
      ...formAutoContent({ foo: 'foo' }),
    })

    assert.ok(!fastifyInstance.hasPlugin('@fastify/formbody'), `The plugin @fastify/formbody is not skipped`)
    assert.equal(response.statusCode, 415, `The response status code is not 415`)

    assert.deepEqual(
      JSON.parse(response.payload),
      {
        statusCode: 415,
        code: 'FST_ERR_CTP_INVALID_MEDIA_TYPE',
        error: 'Unsupported Media Type',
        message: 'Unsupported Media Type: application/x-www-form-urlencoded',
      },
      `The response error is not FST_ERR_CTP_INVALID_MEDIA_TYPE`
    )
  })
})
