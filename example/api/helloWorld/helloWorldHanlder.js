'use strict'

module.exports = async function handler(request, reply) {
  request.log.info(request.getUserId(), 'User ID')

  const httpClient = request.getHttpClient('https://jsonplaceholder.typicode.com/')
  const post = await httpClient.get('/posts/1')
  request.log.info(post.data, 'post')

  const result = {
    hello: request.query.name,
    foo: request.envs.FOO,
    aa: 'vv',
    bb: [{ aa: 'aa' }],
    user: request.getUserId(),
  }
  reply.code(200).send(result)
}
