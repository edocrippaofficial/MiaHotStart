'use strict'

const { describe, it, before, after } = require('node:test')
const assert = require('node:assert/strict')

const nock = require('nock')

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
  before(() => {
    nock.disableNetConnect()
  })

  after(() => {
    nock.enableNetConnect()
  })

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

  it('should make requests and record the duration', async() => {
    const server = await setupFastify()

    const baseUrl = 'https://example.com'

    let response
    server.get('/', async(request, reply) => {
      const axiosClient = request.getHttpClient(baseUrl)
      response = await axiosClient.get('/')
      reply.send('ok')
    })

    const mockResponse = { foo: 'bar' }
    const mockRemoteServer = nock(baseUrl)
      .get('/')
      .reply(200, mockResponse)

    await server.inject({
      method: 'GET',
      url: '/',
    })

    assert.deepStrictEqual(response.data, mockResponse, `The response is not set properly`)
    assert.ok(response.duration > 0, `The duration is not set properly`)
    assert.ok(mockRemoteServer.isDone(), `The request is not made properly`)
  })

  it('should return an error if the http request fails', async() => {
    const server = await setupFastify()

    const errorMessage = 'Request error'
    const baseUrl = 'https://example.com'

    let axiosError
    server.get('/', async(request, reply) => {
      const axiosClient = request.getHttpClient(baseUrl)

      await assert.rejects(axiosClient.get('/'), (error) => {
        axiosError = error
        return true
      })

      reply.send('ok')
    })

    const mockRemoteServer = nock(baseUrl)
      .get('/')
      .replyWithError(errorMessage)

    await server.inject({
      method: 'GET',
      url: '/',
    })

    assert.strictEqual(axiosError.message, errorMessage, `The error message is not set properly`)
    assert.ok(mockRemoteServer.isDone(), `The request is not made properly`)
  })

  it('should return an error if the http response is an error', async() => {
    const server = await setupFastify()

    const errorResponse = { message: 'Response error' }
    const baseUrl = 'https://example.com'

    let axiosError
    server.get('/', async(request, reply) => {
      const axiosClient = request.getHttpClient(baseUrl)

      await assert.rejects(axiosClient.get('/'), (error) => {
        axiosError = error
        return true
      })

      reply.send('ok')
    })

    const mockRemoteServer = nock(baseUrl)
      .get('/')
      .reply(400, errorResponse)

    await server.inject({
      method: 'GET',
      url: '/',
    })

    assert.deepStrictEqual(axiosError.response.data, errorResponse, `The response error body is not set properly`)
    assert.ok(axiosError.duration > 0, `The error duration is not set properly`)
    assert.ok(mockRemoteServer.isDone(), `The request is not made properly`)
  })
})
