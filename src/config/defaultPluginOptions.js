'use strict'

const merge = require('deepmerge')

const defaultOptions = {
  logLevelEnvKey: 'LOG_LEVEL',

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
}

module.exports = function mergeUserOptionsWithDefaults(userOptions) {
  return merge(defaultOptions, userOptions)
}
