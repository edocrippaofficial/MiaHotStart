'use strict'

const Fastify = require('fastify')
const fastifyMia = require('../src')
const { defaultLogger } = require('../src')

const schema = {
  type: 'object',
  properties: {
    HTTP_PORT: { type: 'number', default: 3000 },
    LOG_LEVEL: { type: 'string', default: 'trace' },
    FOO: { type: 'string' },
  },
}

async function setupFastify() {
  const fastify = Fastify({
    logger: defaultLogger,
  })

  await fastify.register(fastifyMia, {
    envSchema: schema,
    disableFastifySwagger: false,
    disableFastifySwaggerUI: false,
    logLevelKey: 'LOG_LEVEL',
  })

  fastify.get('/', async(request, reply) => {
    reply.code(200).send({ hello: request.config.FOO })
  })

  return fastify
}

module.exports = { setupFastify }
