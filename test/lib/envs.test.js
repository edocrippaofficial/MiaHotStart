'use strict'

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')

const fastify = require('fastify')
const fastifyMia = require('../../src')

async function setupFastify(schema) {
  const server = fastify()
  server.register(fastifyMia, {
    envSchema: schema,
    envSchemaOptions: {
      dotenv: {
        path: `${__dirname}/../.test.env`,
      },
    },
  })

  return server
}

describe('Fastify Env', () => {
  const schema = {
    type: 'object',
    properties: {
      FOO: { type: 'string' },
    },
  }

  it('has correctly registered the plugin', async() => {
    const fastifyInstance = await setupFastify(schema)
    assert.ok(fastifyInstance.hasPlugin('@fastify/env'), `The plugin @fastify/env is not registered correctly`)
  })

  it('has correctly parsed the schema', async() => {
    const fastifyInstance = await setupFastify(schema)
    assert.equal(
      fastifyInstance.getEnvs().FOO,
      'BAR',
      `The env is not correctly loaded`
    )
  })

  it('should handle required envs', async() => {
    const schemaWithRequired = {
      ...schema,
      properties: {
        ...schema.properties,
        ENV_NOT_LOADED: { type: 'string' },
      },
      required: ['ENV_NOT_LOADED'],
    }
    await assert.rejects(
      () => setupFastify(schemaWithRequired),
      (error) => {
        return error.message.includes('ENV_NOT_LOADED')
      },
      `The required env ENV_NOT_LOADED is not handled correctly`
    )
  })

  it('has correctly decorated the request instance', async() => {
    const fastifyInstance = await setupFastify(schema)

    let requestEnvs
    fastifyInstance.get('/', (request) => {
      requestEnvs = request.getEnvs()
      return 'ok'
    })
    await fastifyInstance.inject({
      method: 'GET',
      url: '/',
    })

    assert.equal(
      requestEnvs.FOO,
      'BAR',
      `The env is not correctly loaded`
    )
  })
})
