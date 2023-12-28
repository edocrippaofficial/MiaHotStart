'use strict'

const registerFastifyEnvs = require('./envs')
const registerFastifySwagger = require('./swagger')
const registerLogger = require('./logger')
const registerMetrics = require('./metrics')
const registerStatus = require('./status')

module.exports = {
  registerFastifyEnvs,
  registerFastifySwagger,
  registerLogger,
  registerMetrics,
  registerStatus,
}
