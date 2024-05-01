'use strict'

const Fastify = require('fastify')
const miaHotStart = require('mia-hot-start')
const defaultFastifyOptions = require('./defaultFastifyOptions')

const helloWorldRoute = require('./api/helloWorld')

const schema = {
  type: 'object',
  properties: {
    HTTP_PORT: { type: 'number', default: 3000 },
    LOG_LEVEL: { type: 'string', default: 'trace' },
    FOO: { type: 'string', default: 'bar' },
  },
}

/**
 * Returns the Fastify instance
 * @param {Object} [envSchemaOptions] The schema options, used for testing
 * @return {Promise<FastifyInstance | *>} The Fastify instance
 */
async function setupFastify(envSchemaOptions = {}) {
  defaultFastifyOptions.logger.redact.paths.push('MY_SECRET')
  const fastify = Fastify(defaultFastifyOptions)

  fastify.log.info({ MY_SECRET: 'secret' })

  await fastify.register(miaHotStart, {
    envSchema: schema,
    envSchemaOptions,
    logLevelEnvKey: 'LOG_LEVEL',

    customReadyRouteHandler: undefined,
    customHealthzRouteHandler: undefined,
    customCheckUpRouteHandler: undefined,
    gracefulShutdownSeconds: 10,

    platformHeaders: {
      userId: 'miauserid',
      userGroups: 'miausergroups',
      userProperties: 'miauserproperties',
      clientType: 'client-type',
    },

    httpClient: {
      additionalHeadersToProxy: [],
      disableDurationInterceptor: false,
      disableLogsInterceptor: false,
    },

    disableSwagger: false,
    disableMetrics: false,
    disableRequestLogging: false,
    disableStatusRoutes: false,
    disableGracefulShutdown: false,
    disableFormBody: false,
    disablePlatformDecorators: false,
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
