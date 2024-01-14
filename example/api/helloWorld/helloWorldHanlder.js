'use strict'

module.exports = async function handler(request, reply) {
  request.log.info(request.getUserId(), 'User ID')

  const result = {
    hello: request.query.name,
    foo: request.config.FOO,
    aa: 'vv',
    bb: [{ aa: 'aa' }],
    user: request.getUserId(),
  }
  reply.code(200).send(result)
}
