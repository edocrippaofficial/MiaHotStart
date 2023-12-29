'use strict'

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')

const fastify = require('fastify')
const fastifyMia = require('../../src')

async function setupFastify(gracefulShutdownSeconds) {
  const server = fastify()
  server.register(fastifyMia, {
    envSchema: { type: 'object' },
    gracefulShutdownSeconds,
  })

  return server
}

describe('Graceful Shutdown', () => {
  const gracefulShutdownSeconds = 0.3

  it('should shutdown the server after a `SIGTERM` signal', async() => {
    const server = await setupFastify()

    // get symbols from server
    const fastifyState = Reflect.ownKeys(server).find(s => {
      return String(s) === 'Symbol(fastify.state)'
    })

    // send sigterm signal
    process.kill(process.pid, 'SIGTERM')

    // It shouldn't have called `server.close()` right after the signal was sent.
    const closeCalledBefore = server[fastifyState].closing

    // Wait until a bit after the timeout.
    await new Promise((resolve) => setTimeout(resolve, (gracefulShutdownSeconds * 1000) + 100))

    // At this point, the timeout handler should have triggered, and `server.close()` should have been called.
    const closeCalledAfter = server[fastifyState].closing

    assert.deepEqual(closeCalledBefore, false)
    assert.deepEqual(closeCalledAfter, true)
  })
})
