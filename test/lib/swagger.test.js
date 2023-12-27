'use strict'

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')

const fastify = require('fastify')
const fastifyMia = require('../../src')

async function setupFastify({ disableFastifySwagger = false } = {}) {
  const server = fastify()
  server.register(fastifyMia, {
    envSchema: { type: 'object' },
    fastifySwaggerOptions: { host: 'localhost' },
    disableFastifySwagger,
  })

  return server
}

describe('Fastify Swagger', () => {
  it('has correctly registered the plugin', async() => {
    const fastifyInstance = await setupFastify()
    assert.ok(fastifyInstance.hasPlugin('@fastify/swagger'), `The plugin @fastify/swagger is not registered correctly`)
    assert.ok(fastifyInstance.hasPlugin('@fastify/swagger-ui'), `The plugin @fastify/swagger-ui is not registered correctly`)
  })

  it('creates correctly the swagger', async() => {
    const fastifyInstance = await setupFastify()
    await fastifyInstance.ready()
    const swagger = fastifyInstance.swagger()
    assert.equal(
      swagger.info.title,
      'fastifymiaintegrations',
      `The swagger info title is not set correctly`
    )
  })

  it('exposes correctly the json openapi route', async() => {
    const fastifyInstance = await setupFastify()
    await fastifyInstance.ready()

    const response = await fastifyInstance.inject({
      method: 'GET',
      url: '/documentation/json',
    })

    assert.equal(response.statusCode, 200)
    assert.equal(
      JSON.parse(response.payload).info.title,
      'fastifymiaintegrations',
      `The received json is not correct`
    )
  })

  it('exposes correctly the UI', async() => {
    const fastifyInstance = await setupFastify()
    await fastifyInstance.ready()

    const response = await fastifyInstance.inject({
      method: 'GET',
      url: '/documentation/static/index.html',
    })

    assert.equal(response.statusCode, 200)
    assert.equal(
      response.headers['content-type'],
      'text/html; charset=utf-8',
      `The received HTML is not correct`
    )
  })

  it('has correctly skipped the plugin if the option `disableFastifySwagger` is true', async() => {
    const fastifyInstance = await setupFastify({
      disableFastifySwagger: true,
    })
    assert.ok(!fastifyInstance.hasPlugin('@fastify/swagger'), `The plugin @fastify/swagger is not skipped`)
  })
})
