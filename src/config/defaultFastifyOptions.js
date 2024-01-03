'use strict'

const pino = require('pino')

// Sensible default redaction rules
// all first level properties in object or array of objects
// we don't want to see emails, usernames and passwords even if encrypted and/or hashed
const logger = {
  level: 'info',
  redact: {
    paths: [
      'email', '[*].email',
      'password', '[*].password',
      'username', '[*].username',
      'authorization', 'Authorization', '[*].authorization', '[*].Authorization',
      'cookie', 'Cookie', '[*].cookie', '[*].Cookie',
    ],
    censor: '[REDACTED]',
  },
  timestamp: true,
  serializers: {
    error: pino.stdSerializers.err,
  },
}

// Very opinionated default options for the Fastify server instance
module.exports = {
  logger,
  return503OnClosing: false,
  ignoreTrailingSlash: false,
  caseSensitive: true,
  // use “legacy” header version with prefixed x- for better compatibility with existing enterprises infrastructures
  requestIdHeader: 'x-request-id',
  // set 30 seconds to
  pluginTimeout: 30000,
  // virtually disable the max body size limit
  bodyLimit: Number.MAX_SAFE_INTEGER,
  disableRequestLogging: true,
}
