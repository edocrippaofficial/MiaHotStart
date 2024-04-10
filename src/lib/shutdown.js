'use strict'

const { setTimeout: sleep } = require('node:timers/promises')

module.exports = async function shutdown(fastify, opts) {
  if (opts.disableGracefulShutdown) {
    return
  }

  process.on('SIGTERM', async() => {
    const logger = fastify.log
    // Google Kubernetes Engine (GKE) is 10 sec,
    // so the worst case, the iptables rule will
    // be updated 10 seconds later after the pod
    // deletion event arrives
    // https://blog.laputa.io/graceful-shutdown-in-kubernetes-85f1c8d586da
    logger.info('SIGTERM signal received.')

    await sleep(opts.gracefulShutdownSeconds * 1000)

    logger.info('Starting server closure after graceful shutdown period')
    await fastify.close()

    logger.info('Server closed after graceful shutdown')
  })
}
