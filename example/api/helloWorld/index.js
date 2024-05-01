'use strict'

const handler = require('./helloWorldHandler')
const schema = require('./helloWorldSchema')

module.exports = function index(fastify, opts, next) {
  fastify.get('/', { schema }, handler)
  next()
}
