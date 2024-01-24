'use strict'

const { describe, it, before, after } = require('node:test')
const assert = require('node:assert/strict')

const nock = require('nock')
const Pino = require('pino')

const fastify = require('fastify')
const fastifyMia = require('../../src')
const { getHttpClientWithOptions } = require('../../src/lib/httpClient')

const { defaultOptions } = require('../../src/config/defaultPluginOptions')


describe('HTTP Client', () => {
  before(() => {
    nock.disableNetConnect()
  })

  after(() => {
    nock.enableNetConnect()
  })

  describe('getHttpClient', () => {
    it('should return an instance of Axios with baseUrl and the base options', async() => {
      const request = {
        headers: {},
        log: Pino({ level: 'silent' }),
      }

      const baseUrl = 'https://example.com'
      const baseOptions = {
        timeout: 1000,
      }

      const opts = structuredClone(defaultOptions)
      const getHttpClient = getHttpClientWithOptions(opts).bind(request)

      const axiosClient = getHttpClient(baseUrl, baseOptions)

      assert.notEqual(axiosClient, undefined, `The HTTP client is not set properly`)
      assert.equal(axiosClient.defaults.baseURL, baseUrl, `The base URL is not set properly`)
      assert.equal(axiosClient.defaults.timeout, baseOptions.timeout, `The base options are not set properly`)
    })

    it('should handle the platform headers, the additional headers and the base options headers', async() => {
      const request = {
        headers: {
          foo: 'bar',
          miauserid: '1',
          dontForwardMe: 'secret',
        },
        log: Pino({ level: 'silent' }),
      }

      const baseUrl = 'https://example.com'
      const baseOptions = {
        headers: {
          platform: 'test',
        },
      }

      const opts = structuredClone(defaultOptions)
      opts.httpClient.additionalHeadersToProxy = ['foo']
      const getHttpClient = getHttpClientWithOptions(opts).bind(request)

      const axiosClient = getHttpClient(baseUrl, baseOptions)

      const expectedHeaders = {
        platform: 'test',
        foo: 'bar',
        miauserid: '1',
      }

      Object.entries(expectedHeaders).forEach(([key, value]) => {
        assert.equal(axiosClient.defaults.headers[key], value, `The headers are not set properly`)
      })

      assert.equal(axiosClient.defaults.headers.dontForwardMe, undefined)
    })

    describe('Duration decorator', () => {
      it('should make requests and record the duration', async() => {
        const request = {
          headers: {},
          log: Pino({ level: 'silent' }),
        }

        const baseUrl = 'https://example.com'

        const opts = structuredClone(defaultOptions)
        const getHttpClient = getHttpClientWithOptions(opts).bind(request)
        const axiosClient = getHttpClient(baseUrl)

        const mockResponse = { foo: 'bar' }
        const mockRemoteServer = nock(baseUrl)
          .get('/')
          .reply(200, mockResponse)

        const response = await axiosClient.get('/')

        assert.deepStrictEqual(response.data, mockResponse, `The response is not set properly`)
        assert.ok(response.duration > 0, `The duration is not set properly`)
        assert.ok(mockRemoteServer.isDone(), `The request is not made properly`)
      })

      it('should return the error duration if the request throws', async() => {
        const request = {
          headers: {},
          log: Pino({ level: 'silent' }),
        }

        const errorResponse = { message: 'Response error' }
        const baseUrl = 'https://example.com'

        const opts = structuredClone(defaultOptions)
        const getHttpClient = getHttpClientWithOptions(opts).bind(request)
        const axiosClient = getHttpClient(baseUrl)

        const mockRemoteServer = nock(baseUrl)
          .get('/')
          .reply(400, errorResponse)

        await assert.rejects(axiosClient.get('/'), (axiosError) => {
          assert.deepStrictEqual(axiosError.response.data, errorResponse, `The response error body is not set properly`)
          assert.ok(axiosError.duration > 0, `The error duration is not set properly`)
          return true
        })

        assert.ok(mockRemoteServer.isDone(), `The request is not made properly`)
      })
    })

    describe('Log decorator', { todo: true })

    it('should return an error if the http request fails', async() => {
      const request = {
        headers: {},
        log: Pino({ level: 'silent' }),
      }

      const errorMessage = 'Request error'
      const baseUrl = 'https://example.com'

      const mockRemoteServer = nock(baseUrl)
        .get('/')
        .replyWithError(errorMessage)

      const opts = structuredClone(defaultOptions)
      const getHttpClient = getHttpClientWithOptions(opts).bind(request)
      const axiosClient = getHttpClient(baseUrl)

      await assert.rejects(axiosClient.get('/'), (axiosError) => {
        assert.deepStrictEqual(axiosError.message, errorMessage, `The error message is not set properly`)
        return true
      })

      assert.ok(mockRemoteServer.isDone(), `The request is not made properly`)
    })
  })

  describe('FastifyRequest decorator', () => {
    async function setupFastify() {
      const server = fastify()
      server.register(fastifyMia, {
        envSchema: { type: 'object' },
      })

      return server
    }

    it('should return an instance of Axios if called from the Fastify Request', async() => {
      const server = await setupFastify()

      const baseUrl = 'https://example.com'
      const baseOptions = {
        responseType: 'text',
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
      assert.equal(axiosClient.defaults.responseType, baseOptions.responseType, `The base options are not set properly`)
    })
  })
})
