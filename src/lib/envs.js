'use strict'

const fastifyEnv = require('@fastify/env')

module.exports = function envs(fastify, opts) {
  if (opts.enableEnvSchema) {
    fastify.register(fastifyEnv, opts.envSchemaOptions)
  }
}
