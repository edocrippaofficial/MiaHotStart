'use strict'

const path = require('path')
const { name, description, version } = require(path.join(process.cwd(), 'package.json'))

const fastifySwagger = require('@fastify/swagger')
const fastifySwaggerUI = require('@fastify/swagger-ui')

module.exports = async function swagger(fastify, opts) {
  if (opts.disableSwagger) {
    return
  }

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

  await fastify.register(fastifySwaggerUI, {})
}
