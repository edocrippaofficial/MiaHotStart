'use strict'

// eslint-disable-next-line no-shadow
const { setTimeout } = require('node:timers/promises')

module.exports = async function shutdown(fastify, opts) {
  if (opts.disableGracefulShutdown) {
    return
  }

  process.on('SIGTERM', () => {
    // Google Kubernetes Engine (GKE) is 10 sec,
    // so the worst case, the iptables rule will
    // be updated 10 seconds later after the pod
    // deletion event arrives
    // https://blog.laputa.io/graceful-shutdown-in-kubernetes-85f1c8d586da

    fastify.log.fatal('SIGTERM signal received.')
    setTimeout(opts.gracefulShutdownSeconds * 1000)
      .then(() => {
        fastify.log.fatal('Server closed after graceful shutdown')
        fastify.close()
      })
  })
}
