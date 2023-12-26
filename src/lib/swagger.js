'use strict'

const path = require('path')
const { name, description, version } = require(path.join(process.cwd(), 'package.json'))

const fastifySwagger = require('@fastify/swagger')
const scalarUI = require('@scalar/fastify-api-reference')

module.exports = async function swagger(fastify, opts) {
  if (opts.disableFastifySwagger) {
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

  fastify.get('/documentation/json', { schema: { hide: true } }, async() => {
    return fastify.swagger()
  })

  if (opts.disableFastifySwaggerUI) {
    return
  }

  await fastify.register(scalarUI, {
    routePrefix: '/documentation',
    configuration: {
      spec: {
        content: () => fastify.swagger(),
      },
    },
  })
}
