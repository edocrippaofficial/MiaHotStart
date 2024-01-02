'use strict'

const fastifyFormBody = require('@fastify/formbody')

module.exports = async function formbody(fastify, opts) {
  if (opts.disableFormBody) {
    return
  }

  await fastify.register(fastifyFormBody)
}
