'use strict'

const Fastify = require('fastify')
const fastifyMia = require('../src')

const schema = {
  type: 'object',
  properties: {
    FOO: { type: 'string' },
  },
}

async function setupFastify() {
  const fastify = Fastify()

  await fastify.register(fastifyMia, {
    envSchema: schema,
  })

  fastify.get('/', async(request, reply) => {
    reply.code(200).send({ hello: request.config.FOO })
  })

  return fastify
}

module.exports = { setupFastify }
