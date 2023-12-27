'use strict'

module.exports = async function handler(request, reply) {
  const result = {
    hello: request.query.name,
    foo: request.config.FOO,
    aa: 'vv',
    bb: [{ aa: 'aa' }],
  }
  reply.code(200).send(result)
}
