'use strict'

const registerFastifyEnvs = require('./envs')
const registerFastifySwagger = require('./swagger')
const registerLogger = require('./logger')

module.exports = {
  registerFastifyEnvs,
  registerFastifySwagger,
  registerLogger,
}
