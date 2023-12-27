'use strict'

module.exports = async function handler(request, reply) {
  request.log.trace('A trace log....')

  const result = {
    hello: request.query.name,
    foo: request.config.FOO,
  }
  reply.code(200).send(result)
}
