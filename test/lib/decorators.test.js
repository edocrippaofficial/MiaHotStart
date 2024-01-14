'use strict'

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')

const fastify = require('fastify')
const fastifyMia = require('../../src')

async function setupFastify({ platformHeaders, disablePlatformDecorators = false } = {}) {
  const server = fastify()
  server.register(fastifyMia, {
    envSchema: { type: 'object' },
    ...(platformHeaders && { platformHeaders }),
    disablePlatformDecorators,
  })

  return server
}

describe('Decorators', () => {
  it('has correctly registered the request decorators', async() => {
    const fastifyInstance = await setupFastify({
      disablePlatformDecorators: false,
    })
    assert.equal(fastifyInstance.hasRequestDecorator('getUserId'), true)
    assert.equal(fastifyInstance.hasRequestDecorator('getGroups'), true)
    assert.equal(fastifyInstance.hasRequestDecorator('getUserProperties'), true)
    assert.equal(fastifyInstance.hasRequestDecorator('getClientType'), true)
  })

  describe('User Id', () => {
    it('should return the userId with default header', async() => {
      const userId = 'test-user-id'
      let receivedUserId

      const fastifyInstance = await setupFastify()
      fastifyInstance.get('/', async(request, reply) => {
        receivedUserId = request.getUserId()
        reply.send('ok')
      })

      const response = await fastifyInstance.inject({
        method: 'GET',
        url: '/',
        headers: {
          miauserid: userId,
        },
      })

      assert.equal(response.statusCode, 200)
      assert.equal(receivedUserId, userId, `The ID is not the one expected`)
    })
    it('should return the userId with custom header', async() => {
      const userId = 'test-user-id'
      let receivedUserId

      const customHeader = 'x-user-id'

      const fastifyInstance = await setupFastify({
        platformHeaders: {
          userId: customHeader,
        },
      })
      fastifyInstance.get('/', async(request, reply) => {
        receivedUserId = request.getUserId()
        reply.send('ok')
      })

      const response = await fastifyInstance.inject({
        method: 'GET',
        url: '/',
        headers: {
          [customHeader]: userId,
        },
      })

      assert.equal(response.statusCode, 200)
      assert.equal(receivedUserId, userId, `The ID is not the one expected`)
    })
  })

  describe('User Groups', () => {
    it('should return the groups with default header', async() => {
      const userGroups = ['test-group-1', 'test-group-2']
      let receivedUserGroups

      const fastifyInstance = await setupFastify()
      fastifyInstance.get('/', async(request, reply) => {
        receivedUserGroups = request.getGroups()
        reply.send('ok')
      })

      const response = await fastifyInstance.inject({
        method: 'GET',
        url: '/',
        headers: {
          miausergroups: userGroups.join(','),
        },
      })

      assert.equal(response.statusCode, 200)
      assert.deepEqual(
        receivedUserGroups,
        userGroups,
        `The groups are not the ones expected`
      )
    })
    it('should return the groups with custom header', async() => {
      const userGroups = ['test-group-1', 'test-group-2']
      let receivedUserGroups

      const customHeader = 'x-groups-id'

      const fastifyInstance = await setupFastify({
        platformHeaders: {
          userGroups: customHeader,
        },
      })
      fastifyInstance.get('/', async(request, reply) => {
        receivedUserGroups = request.getGroups()
        reply.send('ok')
      })

      const response = await fastifyInstance.inject({
        method: 'GET',
        url: '/',
        headers: {
          [customHeader]: userGroups.join(','),
        },
      })

      assert.equal(response.statusCode, 200)
      assert.deepEqual(
        receivedUserGroups,
        userGroups,
        `The groups are not the ones expected`
      )
    })
    it('should return an empty array if the header is not found', async() => {
      let receivedUserGroups

      const fastifyInstance = await setupFastify()
      fastifyInstance.get('/', async(request, reply) => {
        receivedUserGroups = request.getGroups()
        reply.send('ok')
      })

      const response = await fastifyInstance.inject({
        method: 'GET',
        url: '/',
        headers: {},
      })

      assert.equal(response.statusCode, 200)
      assert.deepEqual(receivedUserGroups, [], `The groups are not the ones expected`)
    })
  })

  describe('User Properties', () => {
    it('should return the user-properties with default header', async() => {
      const userProperties = { test: 'test' }
      let receivedUserProperties

      const fastifyInstance = await setupFastify()
      fastifyInstance.get('/', async(request, reply) => {
        receivedUserProperties = request.getUserProperties()
        reply.send('ok')
      })

      const response = await fastifyInstance.inject({
        method: 'GET',
        url: '/',
        headers: {
          miauserproperties: JSON.stringify(userProperties),
        },
      })

      assert.equal(response.statusCode, 200)
      assert.deepEqual(
        receivedUserProperties,
        userProperties,
        `The user properties are not the ones expected`
      )
    })
    it('should return the user-properties with custom header', async() => {
      const userProperties = { test: 'test' }
      let receivedUserProperties

      const customHeader = 'x-user-properties'

      const fastifyInstance = await setupFastify({
        platformHeaders: {
          userProperties: customHeader,
        },
      })
      fastifyInstance.get('/', async(request, reply) => {
        receivedUserProperties = request.getUserProperties()
        reply.send('ok')
      })

      const response = await fastifyInstance.inject({
        method: 'GET',
        url: '/',
        headers: {
          [customHeader]: JSON.stringify(userProperties),
        },
      })

      assert.equal(response.statusCode, 200)
      assert.deepEqual(
        receivedUserProperties,
        userProperties,
        `The user properties are not the ones expected`
      )
    })
    it('should return `null` if the header is not found', async() => {
      let receivedUserProperties

      const fastifyInstance = await setupFastify()
      fastifyInstance.get('/', async(request, reply) => {
        receivedUserProperties = request.getUserProperties()
        reply.send('ok')
      })

      const response = await fastifyInstance.inject({
        method: 'GET',
        url: '/',
        headers: {},
      })

      assert.equal(response.statusCode, 200)
      assert.deepEqual(
        receivedUserProperties,
        null,
        `The user properties are not the ones expected`
      )
    })
    it('should return `null` if the properties are not a valid JSON', async() => {
      let receivedUserProperties

      const fastifyInstance = await setupFastify()
      fastifyInstance.get('/', async(request, reply) => {
        receivedUserProperties = request.getUserProperties()
        reply.send('ok')
      })

      const response = await fastifyInstance.inject({
        method: 'GET',
        url: '/',
        headers: {
          miauserproperties: '{"foo" : 1, }',
        },
      })

      assert.equal(response.statusCode, 200)
      assert.deepEqual(
        receivedUserProperties,
        null,
        `The user properties are not the ones expected`
      )
    })
  })

  describe('Client Type', () => {
    it('should return the client-type with default header', async() => {
      const clientType = 'test-client-id'
      let receivedClientType

      const fastifyInstance = await setupFastify()
      fastifyInstance.get('/', async(request, reply) => {
        receivedClientType = request.getClientType()
        reply.send('ok')
      })

      const response = await fastifyInstance.inject({
        method: 'GET',
        url: '/',
        headers: {
          'client-type': clientType,
        },
      })

      assert.equal(response.statusCode, 200)
      assert.equal(receivedClientType, clientType, `The client is not the one expected`)
    })
    it('should return the client-type with custom header', async() => {
      const clientType = 'test-client-id'
      let receivedClientType

      const customHeader = 'x-client-type'

      const fastifyInstance = await setupFastify({
        platformHeaders: {
          clientType: customHeader,
        },
      })
      fastifyInstance.get('/', async(request, reply) => {
        receivedClientType = request.getClientType()
        reply.send('ok')
      })

      const response = await fastifyInstance.inject({
        method: 'GET',
        url: '/',
        headers: {
          [customHeader]: clientType,
        },
      })

      assert.equal(response.statusCode, 200)
      assert.equal(receivedClientType, clientType, `The client is not the one expected`)
    })
  })

  it('has correctly skipped the plugin if the option `disablePlatformDecorators` is true', async() => {
    const fastifyInstance = await setupFastify({
      disablePlatformDecorators: true,
    })
    assert.equal(fastifyInstance.hasRequestDecorator('getUserId'), false)
    assert.equal(fastifyInstance.hasRequestDecorator('getGroups'), false)
    assert.equal(fastifyInstance.hasRequestDecorator('getUserProperties'), false)
    assert.equal(fastifyInstance.hasRequestDecorator('getClientType'), false)
  })
})
