# Environmental Variables

The plugin utilizes [fastify-env](https://github.com/fastify/fastify-env) to handle the environmental variables.

## How to setup environmental variables

The plugin accepts 2 properties:

- `envSchema`: the schema object
- `envSchemaOptions`: the additional properties of `fastify-env`

```js
const schema = {
  type: 'object',
  properties: {
    HTTP_PORT: { type: 'number', default: 3000 },
    LOG_LEVEL: { type: 'string', default: 'trace' },
    FOO: { type: 'string', default: 'bar' },
  },
}

const fastify = Fastify()
await fastify.register(MiaHotStart, {
  envSchema: schema,
  envSchemaOptions: {} //optional
})
```

The schema must be a valid [json-schema](https://json-schema.org/).

## How to utilize the variables in your handlers

The object containing all the environmental variables (both the ones specified and the ones with the `default` property) can be found by accessing the `env` property of the `request` (other than the `env` property of the Fastify instance).

As an example, in your handler you can do something like this:

```js
fastifyInstance.get('/', (request, reply) => {
  const requestEnvs = request.envs
  // Use the envs...
  
  reply.code(204).send()
})
```

## How to setup tests utilizing custom variables

To use a set of custom variables for testing follow this steps:

- suppose to have a function that creates and returns the Fastify instance:

`setupFastify.js`
```js
async function setupFastify(envSchemaOptions = {}) {
  const fastify = Fastify()
  await fastify.register(miaHotStart, {
      envSchema: schema,
      envSchemaOptions,
  })

  fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world' })
  })

  return fastify
}
```

The function can receive the `envSchemaOptions` as a parameter.

Then the testing file can create the Fastify instance passing a dotenv configuration pointing to a local `.env` file:

`test.js`
```js
it('should load the envs', async() => {
  const fastify = await setupFastify({
    dotenv: { path: `${__dirname}/test.env` },
  })
  
  const response = await fastify.inject({
    method: 'GET',
    url: '/',
    headers: {
      miauserid: 'USER 1',
    },
  })
  
  // Asserts...
})
```

Check the [example](../example) for more information.
