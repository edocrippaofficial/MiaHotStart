'use strict'

const registerFastifyEnvs = require('./envs')
const registerFastifySwagger = require('./swagger')
const registerLogger = require('./logger')
const registerMetrics = require('./metrics')

module.exports = {
  registerFastifyEnvs,
  registerFastifySwagger,
  registerLogger,
  registerMetrics,
}
