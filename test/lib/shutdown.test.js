'use strict'

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')

const { promisify } = require('node:util')
const sleep = promisify(setTimeout)

const fastify = require('fastify')
const fastifyMia = require('../../src')

async function setupFastify({ gracefulShutdownSeconds, disableGracefulShutdown = false } = {}) {
  const server = fastify()
  server.register(fastifyMia, {
    envSchema: { type: 'object' },
    gracefulShutdownSeconds,
    disableGracefulShutdown,
  })

  return server
}

describe('Graceful Shutdown', () => {
  const gracefulShutdownSeconds = 0.3
  const gracefulShutdownMilliseconds = gracefulShutdownSeconds * 1000

  it('should shutdown the server after a `SIGTERM` signal', async() => {
    const server = await setupFastify({ gracefulShutdownSeconds })

    // get symbol from server indicating the state
    const fastifyState = Reflect.ownKeys(server).find(s => {
      return String(s) === 'Symbol(fastify.state)'
    })

    // save the timestamp of the closing event
    let end
    server.addHook('onClose', async() => {
      end = Date.now()
    })

    // save the timestamp of the signal
    const start = Date.now()

    // send sigterm signal
    process.kill(process.pid, 'SIGTERM')

    // wait for the server to close
    while (server[fastifyState].closing === false) {
      await sleep(100)
    }

    // the difference must be greater than the graceful shutdown timeout
    assert.ok(end - start >= gracefulShutdownMilliseconds, 'The server should have shut down after the timeout')
  })

  it('should not have the listener on the process event if the option `disableGracefulShutdown` is true', async() => {
    process.removeAllListeners('SIGTERM')
    const server = await setupFastify({
      gracefulShutdownSeconds: 10,
      disableGracefulShutdown: true,
    })
    await server.ready()

    const listeners = process.listeners('SIGTERM')
    assert.equal(listeners.length, 0, 'There should be no listeners on the SIGTERM event')
  })
})
