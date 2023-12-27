'use strict'

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')

const fastify = require('fastify')
const fastifyMia = require('../../src')

async function setupFastify(schema, logLevelKey) {
  const server = fastify()
  server.register(fastifyMia, {
    envSchema: schema,
    envSchemaOptions: {
      dotenv: {
        path: `${__dirname}/../.test.env`,
      },
    },
    logLevelKey,
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
    const fastifyInstance = await setupFastify(schema, 'LOG_LEVEL')
    assert.equal(
      fastifyInstance.log.level,
      `debug`,
      `The logger level from the envs is not correctly set`
    )
  })

  it('should default the log level to info if the env is not found', async() => {
    const schema = {
      type: 'object',
      properties: {
        MISSING_LOG_LEVEL: { type: 'string' },
      },
    }

    const fastifyInstance = await setupFastify(schema, 'MISSING_LOG_LEVEL')
    assert.equal(
      fastifyInstance.log.level,
      `info`,
      `The logger level from the envs is not correctly set`
    )
  })

  it('should default the log level to info if the env is not found', async() => {
    const schema = {
      type: 'object',
      properties: {
        WRONG_LOG_LEVEL: { type: 'string', default: 'INVALID' },
      },
    }

    const fastifyInstance = await setupFastify(schema, 'WRONG_LOG_LEVEL')
    assert.equal(
      fastifyInstance.log.level,
      `info`,
      `The logger level from the envs is not correctly set`
    )
  })
})
