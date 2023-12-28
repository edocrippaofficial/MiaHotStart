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
    disableSwagger: false,
    disableMetrics: false,
    disableRequestLogging: false,
    customReadyRouteHandler: undefined,
    customHealthzRouteHandler: undefined,
    customCheckUpRouteHandler: undefined,
  })

  const promClient = fastify.metrics.client
  const customMetric = new promClient.Counter({
    name: 'custom_metric',
    help: 'This is a custom metric',
    labelNames: ['foo'],
  })
  customMetric.labels({ foo: 'bar' }).inc(10)

  fastify.register(helloWorldRoute)

  return fastify
}

module.exports = { setupFastify }
