'use strict'

const fastifyEnv = require('@fastify/env')

module.exports = async function envs(fastify, opts) {
  await fastify.register(fastifyEnv, {
    schema: opts.envSchema,
    confKey: 'envs',
    ...opts.envSchemaOptions,
  })

  fastify.addHook('onRequest', async(request) => {
    request.envs = fastify.envs
  })
}
