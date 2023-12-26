'use strict'

const { setupFastify } = require('./server')

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

