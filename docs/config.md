# Plugin Configuration

This plugin registration accepts an options object which is used to customize the resulting behaviour.  
This document describes the properties available in that options object.

- [envSchema](#envschema)
- [envSchemaOptions](#envSchemaOptions)
- [logLevelEnvKey](#logLevelEnvKey)
- [customReadyRouteHandler](#customReadyRouteHandler)
- [customHealthzRouteHandler](#customHealthzRouteHandler)
- [customCheckUpRouteHandler](#customCheckUpRouteHandler)
- [gracefulShutdownSeconds](#gracefulShutdownSeconds)
- [platformHeaders](#platformHeaders)
- [httpClient](#httpClient)
- [disableSwagger](#disableSwagger)
- [disableMetrics](#disableMetrics)
- [disableRequestLogging](#disableRequestLogging)
- [disableStatusRoutes](#disableStatusRoutes)
- [disableGracefulShutdown](#disableGracefulShutdown)
- [disableFormBody](#disableFormBody)
- [disablePlatformDecorators](#disablePlatformDecorators)

### `envSchema`
- Required: true

The schema for the environmental variables.  
It is required, so if you plan to not have variables just pass an empty object schema:

```json
{ "type": "object", "properties": {} }
```

Example:
```js
const schema = {
  type: 'object',
  properties: {
    HTTP_PORT: { type: 'number', default: 3000 },
    LOG_LEVEL: { type: 'string', default: 'trace' },
    FOO: { type: 'string', default: 'bar' },
  },
}
```

### `envSchemaOptions`
- Required: false
- Default: `{}`

The options for [fastify-env](https://github.com/fastify/fastify-env) other than the `schema` that is provided via the [envSchema](#envschema) properties.

### `logLevelEnvKey`
- Required: false
- Default: `LOG_LEVEL`

The environmental variable containing the log level.

If the variable is set it will be used as the application log level.  
If the variable is not set it will be used the value specified with the Fastify startup config.  
If the variable is set and is invalid (aka different from `error|warn|info|debug|trace|silent`) it will be used `info` as a fallback instead.

### `customReadyRouteHandler`
- Required: false

The Fastify handler used for the route `/-/ready`. It is used by Kubernetes to know if the service is ready to accept traffic, so reply accordingly to this.

Example: if you are connected to a Kafka server link this reply to the status of the connection to the Kafka broker, so that Kubernetes will wait until the service is fully started before routing to it the traffic.

The default value is:

```js
function hanlder(request, reply) {
  reply.send({
    status: 'OK',
    name: package_name,
    version: package_version,
  })
}
```

### `customHealthzRouteHandler`
- Required: false

The Fastify handler used for the route `/-/healthz`. It is used by Kubernetes to know if the service is still alive and healthy, so reply accordingly to this.

Example: if you are connected to a Kafka server link this reply to the status of the connection to the Kafka broker, so that Kubernetes will kill the pod and recreate a new one if the connection drops.

The default value is:

```js
function hanlder(request, reply) {
  reply.send({
    status: 'OK',
    name: package_name,
    version: package_version,
  })
}
```

### `customCheckUpRouteHandler`
- Required: false

The Fastify handler used for the route `/-/check-up`.

The default value is:

```js
function hanlder(request, reply) {
  reply.send({
    status: 'OK',
    name: package_name,
    version: package_version,
  })
}
```

### `gracefulShutdownSeconds`
- Required: false
- Default: 10

### `platformHeaders`
- Required: false

It accepts an object with the following properties:
- `userId`
  - Required: false
  - Default: `miauserid`

- `userGroups`
  - Required: false
  - Default: `miausergroups`

- `userProperties`
  - Required: false
  - Default: `miauserproperties`

- `clientType`
  - Required: false
  - Default: `client-type`

### `httpClient`
- Required: false

- `additionalHeadersToProxy`
  - Required: false
  - Default: `[]`

- `disableDurationInterceptor`
  - Required: false
  - Default: `false`

- `disableLogsInterceptor`
  - Required: false
  - Default: `false`

### `disableSwagger`
- Required: false
- Default: `false`

### `disableMetrics`
- Required: false
- Default: `false`

### `disableRequestLogging`
- Required: false
- Default: `false`

### `disableStatusRoutes`
- Required: false
- Default: `false`

### `disableGracefulShutdown`
- Required: false
- Default: `false`

### `disableFormBody`
- Required: false
- Default: `false`

### `disablePlatformDecorators`
- Required: false
- Default: `false`

