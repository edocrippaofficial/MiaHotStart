'use strict'

const fp = require('fastify-plugin')

const pluginName = 'Mia Platform Plugin'

const {
  registerFastifyEnvs,
  registerFastifySwagger,
  registerLogger,
} = require('./lib')

const {
  defaultLogger,
} = require('./config')

async function plugin(fastify, opts) {
  await registerFastifyEnvs(fastify, opts)
  await registerFastifySwagger(fastify, opts)
  await registerLogger(fastify, opts)
}

module.exports = fp(plugin, {
  fastify: '4.x',
  name: pluginName,
})

module.exports.pluginName = pluginName
module.exports.defaultLogger = defaultLogger
