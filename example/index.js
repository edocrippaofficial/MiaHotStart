'use strict'

const { setupFastify } = require('./server')

async function main() {
  const fastify = await setupFastify()
  const port = fastify.config.HTTP_PORT || 3000
  fastify.listen({ port }, (error) => {
    if (error) {
      fastify.log.error(error)
      throw error
    }
  })
}

main()

