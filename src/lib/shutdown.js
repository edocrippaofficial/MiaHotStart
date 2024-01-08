'use strict'

const { setTimeout: sleep } = require('node:timers/promises')

module.exports = async function shutdown(fastify, opts) {
  if (opts.disableGracefulShutdown) {
    return
  }

  process.on('SIGTERM', async() => {
    // Google Kubernetes Engine (GKE) is 10 sec,
    // so the worst case, the iptables rule will
    // be updated 10 seconds later after the pod
    // deletion event arrives
    // https://blog.laputa.io/graceful-shutdown-in-kubernetes-85f1c8d586da
    fastify.log.fatal('SIGTERM signal received.')

    await sleep(opts.gracefulShutdownSeconds * 1000)

    fastify.log.fatal('Starting server close after graceful shutdown')
    await fastify.close()

    // eslint-disable-next-line no-console
    console.log('Server closed after graceful shutdown')
  })
}
