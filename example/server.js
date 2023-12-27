'use strict'

const Fastify = require('fastify')
const fastifyMia = require('../src')
const { defaultFastifyOptions, defaultLogger } = require('../src')

const helloWorldRoute = require('./api/helloWorld')

const schema = {
  type: 'object',
  properties: {
    HTTP_PORT: { type: 'number', default: 3000 },
    LOG_LEVEL: { type: 'string', default: 'trace' },
    FOO: { type: 'string', default: 'bar' },
  },
}

async function setupFastify() {
  const fastify = Fastify({
    ...defaultFastifyOptions,
    logger: defaultLogger,
  })

  await fastify.register(fastifyMia, {
    envSchema: schema,
    envSchemaOptions: {},
    logLevelKey: 'LOG_LEVEL',
    disableFastifySwagger: false,
    disableFastifySwaggerUI: false,
    disableRequestLogging: false,
  })

  fastify.register(helloWorldRoute)

  return fastify
}

module.exports = { setupFastify }
