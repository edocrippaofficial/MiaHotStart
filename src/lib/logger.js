'use strict'

module.exports = async function logger(fastify, opts) {
  if (opts.disableRequestLogging) {
    return
  }

  fastify.log.level = getLogLevel(fastify, opts)

  fastify
    .addHook('onRequest', logIncomingRequest)
    .addHook('onSend', logOutgoingReply)
    .addHook('onResponse', logRequestCompleted)
}

function getLogLevel(fastify, opts) {
  const logLevelFromEnv = fastify.envs[opts.logLevelEnvKey]

  if (!logLevelFromEnv) {
    fastify.log.warn(`No log level set, defaulting to ${fastify.log.level}`)
    return fastify.log.level
  }

  if (!isLogLevelValid(logLevelFromEnv)) {
    fastify.log.warn(`Invalid log level set: ${logLevelFromEnv}, defaulting to info`)
    return 'info'
  }

  return logLevelFromEnv
}

const LOG_LEVEL_REGEX = new RegExp('^(error|warn|info|debug|trace|silent)$')
function isLogLevelValid(logLevel) {
  return LOG_LEVEL_REGEX.test(logLevel)
}

function logIncomingRequest(req, reply, next) {
  const { method, url, headers, params, query, body } = req
  req.log.trace({
    http: {
      request: {
        method,
        userAgent: {
          original: headers['user-agent'],
        },
      },
    },
    url: { path: url, params, query },
    body,
    host: {
      hostname: headers['host'] && removePort(headers['host']),
      forwardedHostName: headers['x-forwarded-host'],
      ip: headers['x-forwarded-for'],
    },
  }, 'incoming request')
  next()
}

// log with level trace only the body response for json replies
function logOutgoingReply(req, reply, payload, next) {
  if (reply.getHeader('content-type')?.includes('application/json')) {
    const { statusCode } = reply
    req.log.trace({
      statusCode,
      body: payload,
    }, 'outgoing response')
  }
  next()
}

function logRequestCompleted(req, reply, next) {
  const { method, url, headers, params } = req
  const { statusCode, additionalRequestCompletedLogInfo } = reply
  req.log.info({
    ...additionalRequestCompletedLogInfo,
    http: {
      request: {
        method,
        userAgent: {
          original: headers['user-agent'],
        },
      },
      response: {
        statusCode,
        body: {
          bytes: parseInt(reply.getHeader('content-length'), 10) || undefined,
        },
      },
    },
    url: { path: url, params },
    host: {
      hostname: headers['host'] && removePort(headers['host']),
      forwardedHost: headers['x-forwarded-host'],
      ip: headers['x-forwarded-for'],
    },
    responseTime: reply.elapsedTime,
  }, 'request completed')
  next()
}

function removePort(host) {
  const hostname = host.split(':')
  return hostname[0]
}
