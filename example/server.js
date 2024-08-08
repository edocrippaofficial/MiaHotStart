'use strict'

const { setupFastify } = require('./app')

async function main() {
  const fastify = await setupFastify()
  const port = fastify.getEnvs().HTTP_PORT || 3000
  fastify.listen({ port }, (error) => {
    if (error) {
      fastify.log.error(error)
      throw error
    }
  })
}

main()

