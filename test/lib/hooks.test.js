'use strict'

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const { PassThrough } = require('node:stream')

const fastify = require('fastify')
const fastifyMia = require('../../src')

describe('Hooks', () => {
  const schema = {
    type: 'object',
    properties: {
      LOG_LEVEL: { type: 'string' },
    },
  }

  describe('Healthy Hooks', () => {
    it('has correctly registered the healthy hooks', async() => {
      const passThrough = new PassThrough()
      const server = fastify({
        logger: {
          stream: passThrough,
        },
      })

      await server.register(fastifyMia, {
        envSchema: schema,
        envSchemaOptions: {
          dotenv: {
            path: `${__dirname}/../.test.env`,
          },
        },
        logLevelEnvKey: 'LOG_LEVEL',
        disableHealthyHooks: false,
      })

      await server.ready()

      const listenPromise = new Promise((resolve) => {
        server.listen({ port: 10001 }, () => {
          resolve()
        })
      })
      await listenPromise
      await server.close()

      const logs = passThrough
        .read()
        .toString()
        .split('\n')
        .filter(line => line.length > 0)
        .map(line => JSON.parse(line))

      assert.ok(logs.some(log => log.msg.includes('listen event reached')))
      assert.ok(logs.some(log => log.msg.includes('ready event reached')))
    })
    it('has correctly skipped the plugin if the option `disableHealthyHooks` is true', async() => {
      const passThrough = new PassThrough()
      const server = fastify({
        logger: {
          stream: passThrough,
        },
      })

      await server.register(fastifyMia, {
        envSchema: schema,
        envSchemaOptions: {
          dotenv: {
            path: `${__dirname}/../.test.env`,
          },
        },
        logLevelEnvKey: 'LOG_LEVEL',
        disableHealthyHooks: true,
      })

      await server.ready()

      const listenPromise = new Promise((resolve) => {
        server.listen({ port: 10002 }, () => {
          resolve()
        })
      })
      await listenPromise
      await server.close()

      const logs = passThrough
        .read()
        .toString()
        .split('\n')
        .filter(line => line.length > 0)
        .map(line => JSON.parse(line))

      assert.ok(!logs.some(log => log.msg.includes('listen event reached')))
      assert.ok(!logs.some(log => log.msg.includes('ready event reached')))
    })
  })
})
