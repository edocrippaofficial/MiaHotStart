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
    logLevelKey: 'LOG_LEVEL',
  })

  return server
}

describe('Logger', () => {
  const schema = {
    type: 'object',
    properties: {
      LOG_LEVEL: { type: 'string' },
    },
  }

  it('has correctly registered the logger level set in the envs', async() => {
    const fastifyInstance = await setupFastify(schema)
    assert.equal(
      fastifyInstance.log.level,
      `debug`,
      `The logger level from the envs is not correctly set`
    )
  })
})
