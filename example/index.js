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

async function main() {
  const fastify = await setupFastify()
  fastify.listen({ port: 3000 }, (error) => {
    if (error) {
      fastify.log.error(error)
      throw error
    }
  })
}

main()

module.exports = { setupFastify }

