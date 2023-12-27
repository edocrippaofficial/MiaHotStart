'use strict'
// Very opinionated default options for the Fastify server instance
module.exports = {
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
