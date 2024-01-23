'use strict'

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')

const fastify = require('fastify')
const fastifyMia = require('../../src')

async function setupFastify(httpClient) {
  const server = fastify()
  server.register(fastifyMia, {
    envSchema: { type: 'object' },
    ...(httpClient && { httpClient }),
  })

  return server
}

describe('HTTP Client', () => {
  it('should return an instance of Axios with baseUrl and the base options', async() => {
    const server = await setupFastify()

    const baseUrl = 'https://example.com'
    const baseOptions = {
      timeout: 1000,
    }

    let axiosClient
    server.get('/', (request, reply) => {
      axiosClient = request.getHttpClient(baseUrl, baseOptions)
      reply.send('ok')
    })

    await server.inject({
      method: 'GET',
      url: '/',
    })

    assert.notEqual(axiosClient, undefined, `The HTTP client is not set properly`)
    assert.equal(axiosClient.defaults.baseURL, baseUrl, `The base URL is not set properly`)
    assert.equal(axiosClient.defaults.timeout, baseOptions.timeout, `The base options are not set properly`)
  })

  it('should handle the platform headers, the additional headers and the base options headers', async() => {
    const server = await setupFastify({
      additionalHeadersToProxy: ['foo'],
    })

    const baseUrl = 'https://example.com'
    const baseOptions = {
      headers: {
        platform: 'test',
      },
    }

    let axiosClient
    server.get('/', (request, reply) => {
      axiosClient = request.getHttpClient(baseUrl, baseOptions)
      reply.send('ok')
    })

    await server.inject({
      method: 'GET',
      url: '/',
      headers: {
        foo: 'bar',
        miauserid: '1',
      },
    })

    const expectedHeaders = {
      platform: 'test',
      foo: 'bar',
      miauserid: '1',
    }

    Object.entries(expectedHeaders).forEach(([key, value]) => {
      assert.equal(axiosClient.defaults.headers[key], value, `The headers are not set properly`)
    })
  })
})
