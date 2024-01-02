'use strict'

const fastifyMetrics = require('fastify-metrics')

module.exports = async function metrics(fastify, opts) {
  if (opts.disableMetrics) {
    return
  }

  await fastify.register(fastifyMetrics, {
    endpoint: {
      url: '/-/metrics',
      logLevel: 'warn',
      schema: { hide: true },
    },
    clearRegisterOnInit: true,
  })
}
