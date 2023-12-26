'use strict'

const pino = require('pino')

module.exports = {
  level: 'info',
  redact: defaultRedactionRules(),
  timestamp: timestampFunction,
  serializers: {
    error: pino.stdSerializers.err,
  },
}

// Sensible default redaction rules
// all first level properties in object or array of objects
// we don't want to see emails, usernames and passwords even if encrypted and/or hashed
function defaultRedactionRules() {
  return {
    paths: [
      'email', '[*].email',
      'password', '[*].password',
      'username', '[*].username',
      'authorization', 'Authorization', '[*].authorization', '[*].Authorization',
      'cookie', 'Cookie', '[*].cookie', '[*].Cookie',
    ],
    censor: '[REDACTED]',
  }
}

function timestampFunction() {
  return `,"time":${Date.now()}`
}
