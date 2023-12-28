'use strict'

const path = require('path')
const { name, version } = require(path.join(process.cwd(), 'package.json'))

const schema = require('../schema/statusRoute.shcema')

module.exports = async function status(fastify, opts) {
  fastify.get('/-/ready', { schema }, opts.customReadyRouteHandler ?? statusHandler)
  fastify.get('/-/healthz', { schema }, opts.customHealthzRouteHandler ?? statusHandler)
  fastify.get('/-/check-up', { schema }, opts.customCheckUpRouteHandler ?? statusHandler)
}

async function statusHandler(request, reply) {
  reply.send({
    status: 'OK',
    name: process.env.npm_package_name || name,
    version: process.env.npm_package_version || version,
  })
}
