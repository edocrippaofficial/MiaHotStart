'use strict'

const fp = require('fastify-plugin')

const pluginName = 'Mia Platform Plugin'

const {
  registerFastifyEnvs,
  registerFastifySwagger,
} = require('./lib')

async function plugin(fastify, opts) {
  await registerFastifyEnvs(fastify, opts)
  await registerFastifySwagger(fastify, opts)
}

module.exports = fp(plugin, {
  fastify: '4.x',
  name: pluginName,
})

module.exports.pluginName = pluginName
