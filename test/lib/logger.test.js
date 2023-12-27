'use strict'

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const { PassThrough } = require('node:stream')

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
      `trace`,
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

  it('has correctly skipped the plugin if the option `disableRequestLogging` is true', async() => {
    const passThrough = new PassThrough()
    const server = fastify({
      logger: {
        stream: passThrough,
      },
      disableRequestLogging: true,
    })

    await server.register(fastifyMia, {
      envSchema: schema,
      envSchemaOptions: {
        dotenv: {
          path: `${__dirname}/../.test.env`,
        },
      },
      logLevelKey: 'LOG_LEVEL',
      disableRequestLogging: true,
    })

    server.get('/', async(request, reply) => {
      reply.send({ msg: 'test' })
    })

    await server.ready()
    await server.inject({
      method: 'GET',
      url: '/',
    })

    // If disableRequestLogging is false, log would have contained the log buffer
    const log = passThrough.read()
    assert.equal(log, null)
  })

  it('should not log the response body if the content-type is not application/json', async() => {
    const passThrough = new PassThrough()
    const server = fastify({
      logger: {
        stream: passThrough,
      },
      disableRequestLogging: true,
    })

    server.register(fastifyMia, {
      envSchema: schema,
      envSchemaOptions: {
        dotenv: {
          path: `${__dirname}/../.test.env`,
        },
      },
      logLevelKey: 'LOG_LEVEL',
    })

    server.get('/', async(request, reply) => {
      reply.header('content-type', 'text/html')
      reply.send()
    })

    await server.ready()
    await server.inject({
      method: 'GET',
      url: '/',
    })

    const logs = passThrough
      .read()
      .toString()
      .split('\n')
    assert.equal(logs.length, 3)
    assert.ok(
      !logs.some((log) => log.includes('outgoing response')),
      `The HTML response should not be logged`
    )
  })
})
