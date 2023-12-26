'use strict'

const path = require('path')
const { name, description, version } = require(path.join(process.cwd(), 'package.json'))

const fastifySwagger = require('@fastify/swagger')

module.exports = async function swagger(fastify, opts) {
  const swaggerDefinition = {
    info: {
      title: name,
      description,
      version,
    },
    mode: 'dynamic',
    consumes: ['application/json', 'application/x-www-form-urlencoded'],
    produces: ['application/json'],
  }

  await fastify.register(fastifySwagger, {
    openapi: swaggerDefinition,
    ...opts.fastifySwaggerOptions,
  })
}
