'use strict'

const { setupFastify } = require('./app')

async function main() {
  const fastify = await setupFastify()
  fastify.log.info(`Server running with pid ${process.pid}`)
  const port = fastify.envs.HTTP_PORT || 3000
  fastify.listen({ port }, (error) => {
    if (error) {
      fastify.log.error(error)
      throw error
    }
  })
}

main()

