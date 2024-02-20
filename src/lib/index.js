'use strict'

const registerEnvs = require('./envs')
const registerSwagger = require('./swagger')
const registerLogger = require('./logger')
const registerMetrics = require('./metrics')
const registerStatus = require('./status')
const registerShutdown = require('./shutdown')
const registerFormBody = require('./formbody')
const registerPlatformDecorators = require('./decorators')
const registerHttpClient = require('./httpClient')

module.exports = {
  registerEnvs,
  registerSwagger,
  registerLogger,
  registerMetrics,
  registerStatus,
  registerShutdown,
  registerFormBody,
  registerPlatformDecorators,
  registerHttpClient,
}
