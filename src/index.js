'use strict'

const fp = require('fastify-plugin')

const pluginName = 'Mia Platform Plugin'

const {
  registerFastifyEnvs,
} = require('./lib')

function plugin(fastify, opts, done) {
  registerFastifyEnvs(fastify, opts)

  done()
}

module.exports = fp(plugin, {
  fastify: '4.x',
  name: pluginName,
})

module.exports.pluginName = pluginName
