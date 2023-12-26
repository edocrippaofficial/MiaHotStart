'use strict'

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')

const fastify = require('fastify')
const fastifyMia = require('../src/index')
const { pluginName } = require('../src/index')

async function setupFastify() {
  const server = fastify()

  const envSchema = { type: 'object', properties: {} }
  server.register(fastifyMia, { envSchema })

  return server
}

describe('Mia Plugin', () => {
  it('has correctly registered the plugin', async() => {
    const fastifyInstance = await setupFastify()
    assert.ok(fastifyInstance.hasPlugin(pluginName), `The plugin is not registered correctly`)
  })
})
