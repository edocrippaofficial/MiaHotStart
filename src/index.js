'use strict'

const fp = require('fastify-plugin')
const fastifyEnv = require('@fastify/env')

const pluginName = 'Mia Platform Plugin'

function plugin(fastify, opts, pluginDone) {
  if (opts.enableEnvSchema) {
    fastify.register(fastifyEnv, opts.envSchemaOptions)
  }

  pluginDone()
}

module.exports = fp(plugin, {
  fastify: '4.x',
  name: pluginName,
})

module.exports.pluginName = pluginName
