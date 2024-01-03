'use strict'

const defaultOptions = {
  logLevelKey: 'LOG_LEVEL',

  gracefulShutdownSeconds: 10,

  disableSwagger: false,
  disableMetrics: false,
  disableRequestLogging: false,
  disableStatusRoutes: false,
  disableGracefulShutdown: false,
  disableFormBody: false,
}

module.exports = function mergeUserOptionsWithDefaults(userOptions) {
  return { ...defaultOptions, ...userOptions }
}
