'use strict'

const merge = require('deepmerge')

const defaultOptions = {
  logLevelKey: 'LOG_LEVEL',

  gracefulShutdownSeconds: 10,

  platformHeaders: {
    userId: 'miauserid',
    userGroups: 'miausergroups',
    userProperties: 'miauserproperties',
    clientType: 'client-type',
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
