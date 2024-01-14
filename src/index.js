'use strict'

const fp = require('fastify-plugin')

const pluginName = 'Mia Platform Plugin'

const {
  registerFastifyEnvs,
  registerFastifySwagger,
  registerLogger,
  registerMetrics,
  registerStatus,
  registerShutdown,
  registerFormBody,
  registerPlatformDecorators,
} = require('./lib')

const {
  mergeUserOptionsWithDefaults,
  defaultFastifyOptions,
} = require('./config')

async function plugin(fastify, userOptions) {
  const opts = mergeUserOptionsWithDefaults(userOptions)

  await registerFastifyEnvs(fastify, opts)
  await registerFastifySwagger(fastify, opts)
  await registerLogger(fastify, opts)
  await registerMetrics(fastify, opts)
  await registerStatus(fastify, opts)
  await registerShutdown(fastify, opts)
  await registerFormBody(fastify, opts)
  await registerPlatformDecorators(fastify, opts)
}

module.exports = fp(plugin, {
  fastify: '4.x',
  name: pluginName,
})

module.exports.pluginName = pluginName
module.exports.defaultFastifyOptions = defaultFastifyOptions
