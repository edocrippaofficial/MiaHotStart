'use strict'

const path = require('path')
const { name, version } = require(path.join(process.cwd(), 'package.json'))

const schema = require('../schema/statusRoute.shcema')

module.exports = async function status(fastify, opts) {
  if (opts.disableStatusRoutes) {
    return
  }

  const fastifyLogLevel = fastify.log.level
  const logLevel = fastifyLogLevel === 'silent' ? fastifyLogLevel : 'error'
  fastify.get('/-/ready', { schema, logLevel }, opts.customReadyRouteHandler ?? statusHandler)
  fastify.get('/-/healthz', { schema, logLevel }, opts.customHealthzRouteHandler ?? statusHandler)
  fastify.get('/-/check-up', { schema, logLevel }, opts.customCheckUpRouteHandler ?? statusHandler)
}

async function statusHandler(request, reply) {
  reply.send({
    status: 'OK',
    name: process.env.npm_package_name || name,
    version: process.env.npm_package_version || version,
  })
}
