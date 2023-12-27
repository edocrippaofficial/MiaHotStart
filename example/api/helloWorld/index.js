'use strict'

const handler = require('./helloWorldHanlder')
const schema = require('./helloWorldSchema')

module.exports = function index(fastify, opts, next) {
  fastify.get('/', { schema }, handler)
  next()
}
