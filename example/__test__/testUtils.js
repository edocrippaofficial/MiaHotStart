'use strict'

const testEnvs = {
  LOG_LEVEL: 'silent',
  FOO: 'BAR',
  HTTP_PORT: 3000,
}

function loadTestEnvs() {
  Object.assign(process.env, testEnvs)
}

module.exports = {
  testEnvs,
  loadTestEnvs,
}
