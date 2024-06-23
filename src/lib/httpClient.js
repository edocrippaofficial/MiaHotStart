'use strict'

const axios = require('axios')
const deepmerge = require('deepmerge')

module.exports = async function httpClient(fastify, opts) {
  fastify.decorateRequest('getHttpClient', getHttpClientWithOptions(opts))
}

function getHttpClientWithOptions(opts) {
  const {
    additionalHeadersToProxy,
    disableDurationInterceptor,
    disableLogsInterceptor,
    disableEnhancedErrorMessageInterceptor,
  } = opts?.httpClient
  return function getHttpClient(baseUrl, baseOptions) {
    const platformHeadersToProxy = Object.values(opts.platformHeaders)
    const headersToProxy = platformHeadersToProxy.concat(additionalHeadersToProxy)

    const additionalHeaders = getHeadersFromRequest(this, headersToProxy)
    additionalHeaders['request-id'] = this.id
    additionalHeaders['x-request-id'] = this.id

    const axiosInstance = axios.create({
      ...baseOptions,
      headers: deepmerge(additionalHeaders, baseOptions?.headers || {}),
      baseURL: baseUrl,
    })

    if (!disableDurationInterceptor) {
      decorateResponseWithDuration(axiosInstance)
    }

    if (!disableLogsInterceptor) {
      decorateWithLogs(axiosInstance, this.log)
    }

    if (!disableEnhancedErrorMessageInterceptor) {
      decorateResponseWithEnhancedErrorMessage(axiosInstance)
    }

    decorateResponseWithErrorStatusCode(axiosInstance)

    return axiosInstance
  }
}
module.exports.getHttpClientWithOptions = getHttpClientWithOptions

function getHeadersFromRequest(request, additionalHeadersToProxy) {
  return additionalHeadersToProxy.reduce((acc, header) => {
    if (request.headers[header]) {
      acc[header] = request.headers[header]
    }
    return acc
  }, {})
}

/**
 * Adds the duration field to the response object
 * @param {AxiosInstance} axiosInstance The Axios instance
 * @param {Logger} logger The logger instance
 * @returns {void} -
 */
function decorateWithLogs(axiosInstance, logger) {
  axiosInstance.interceptors.request.use(
    (config) => {
      logger?.trace({
        baseURL: config.baseURL,
        url: config.url,
        headers: config.headers,
        data: config.data,
        method: config.method,
      }, 'make call')
      return config
    })

  axiosInstance.interceptors.response.use(
    (response) => {
      logger?.trace({
        baseURL: response.config.baseURL,
        url: response.config.url,
        method: response.config.method,
        statusCode: response.status,
        headers: { ...response.headers.toJSON() },
        data: response.data,
        duration: response.duration,
      }, 'response info')
      return response
    },
    (error) => {
      if (error.response) {
        logger?.trace({
          baseURL: error.config.baseURL,
          url: error.config.url,
          method: error.config.method,
          statusCode: error.response.status,
          headers: { ...error.response.headers.toJSON() },
          data: error.response.data,
          duration: error.response.duration,
        }, 'response error')
      } else {
        logger?.trace({
          baseURL: error.config.baseURL,
          url: error.config.url,
          message: error.message,
        }, 'request error')
      }
      return Promise.reject(error)
    })
}

/**
 * Adds the duration field to the response object
 * @param {AxiosInstance} axiosInstance The Axios instance
 * @returns {void} -
 */
function decorateResponseWithDuration(axiosInstance) {
  axiosInstance.interceptors.request.use(
    (config) => {
      config.metadata = { startTime: new Date() }
      return config
    })

  axiosInstance.interceptors.response.use(
    (response) => {
      response.config.metadata.endTime = new Date()
      response.duration = response.config.metadata.endTime - response.config.metadata.startTime
      return response
    },
    (error) => {
      error.config.metadata.endTime = new Date()
      error.duration = error.config.metadata.endTime - error.config.metadata.startTime
      return Promise.reject(error)
    })
}

/**
 * Enhance the error message with the message from the API response, if present
 * @param {AxiosInstance} axiosInstance The Axios instance
 * @returns {void} -
 */
function decorateResponseWithEnhancedErrorMessage(axiosInstance) {
  axiosInstance.interceptors.response.use(
    (response) => { return response },
    (error) => {
      if (error?.response?.data?.message) {
        error.message = `${error.message} with message ${error.response?.data?.message}`
      }
      return Promise.reject(error)
    })
}

/**
 * Enhance the error object with the statusCode from the API response, if present.
 * Fastify will use this property to set the code of the reply.
 * @param {AxiosInstance} axiosInstance The Axios instance
 * @returns {void} -
 */
function decorateResponseWithErrorStatusCode(axiosInstance) {
  axiosInstance.interceptors.response.use(
    (response) => { return response },
    (error) => {
      error.statusCode = error.response?.status
      return Promise.reject(error)
    })
}
