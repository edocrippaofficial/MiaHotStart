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

    // get symbols from server
    const fastifyState = Reflect.ownKeys(server).find(s => {
      return String(s) === 'Symbol(fastify.state)'
    })

    // send sigterm signal
    process.kill(process.pid, 'SIGTERM')

    // It shouldn't have called `server.close()` right after the signal was sent.
    const closeCalledBefore = server[fastifyState].closing

    // Wait until a bit after the timeout.
    await sleep(gracefulShutdownMilliseconds + 100)

    // At this point, the timeout handler should have triggered, and `server.close()` should have been called.
    const closeCalledAfter = server[fastifyState].closing

    assert.equal(closeCalledBefore, false, '`server.close()` should not have been called before the timeout')
    assert.equal(closeCalledAfter, true, '`server.close()` should have been called after the timeout')
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
