'use strict'

module.exports = async function decorators(fastify, opts) {
  if (opts.disablePlatformDecorators) {
    return
  }

  fastify.decorateRequest('getUserId', function getUserId() {
    return this.headers[opts.platformHeaders.userId]
  })

  fastify.decorateRequest('getGroups', function getGroups() {
    const userGroupsAsString = this.headers[opts.platformHeaders.userGroups]

    if (!userGroupsAsString) {
      return []
    }

    return userGroupsAsString
      .split(',')
      .filter((el) => el.length > 0)
  })

  fastify.decorateRequest('getUserProperties', function getUserProperties() {
    const userPropertiesAsString = this.headers[opts.platformHeaders.userProperties]

    if (!userPropertiesAsString) {
      return null
    }

    try {
      return JSON.parse(userPropertiesAsString)
    } catch (error) {
      return null
    }
  })

  fastify.decorateRequest('getClientType', function getClientType() {
    return this.headers[opts.platformHeaders.clientType]
  })
}
