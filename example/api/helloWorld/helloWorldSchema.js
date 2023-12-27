'use strict'

module.exports = {
  tags: ['Mia Integrations Examples'],
  querystring: {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        hello: { type: 'string', example: 'world' },
      },
      additionalProperties: true,
    },
    '4xx': {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'error' },
      },
    },
  },
}
