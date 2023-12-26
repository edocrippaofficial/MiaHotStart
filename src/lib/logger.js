'use strict'

module.exports = async function logger(fastify, opts) {
  fastify.log.level = fastify.config[opts.logLevelKey] || 'info'
}
