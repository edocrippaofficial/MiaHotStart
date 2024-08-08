'use strict'
const { hrtime } = require('node:process')

module.exports = async function hooks(fastify, opts) {
  if (opts.disableHealthyHooks) {
    return
  }

  const start = hrtime.bigint()

  fastify.addHook('onReady', () => {
    fastify.log.info({ elapsedMs: Number(hrtime.bigint() - start) / 1_000_000 }, 'ready event reached')
  })
  fastify.addHook('onListen', () => {
    fastify.log.info({ elapsedMs: Number(hrtime.bigint() - start) / 1_000_000 }, 'listen event reached')
  })
}
