'use strict'

const fastifyEnv = require('@fastify/env')

module.exports = async function envs(fastify, opts) {
  await fastify.register(fastifyEnv, {
    schema: opts.envSchema,
    ...opts.envSchemaOptions,
  })
}
