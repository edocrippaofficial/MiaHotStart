'use strict'

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')

const fastify = require('fastify')
const fastifyMia = require('../../src')

async function setupFastify() {
  const server = fastify()
  server.register(fastifyMia, {
    envSchema: { type: 'object' },
    fastifySwaggerOptions: { host: 'localhost' },
  })

  return server
}

describe('Fastify Swagger', () => {
  it('has correctly registered the plugin', async() => {
    const fastifyInstance = await setupFastify()
    assert.ok(fastifyInstance.hasPlugin('@fastify/swagger'), `The plugin @fastify/swagger is not registered correctly`)
  })

  it('exposes correctly the swagger', async() => {
    const fastifyInstance = await setupFastify()
    await fastifyInstance.ready()
    const swagger = fastifyInstance.swagger()
    assert.equal(
      swagger.info.title,
      'fastifymiaintegrations',
      `The swagger info title is not set correctly`
    )
  })
})
