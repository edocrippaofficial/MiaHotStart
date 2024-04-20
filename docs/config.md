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

## List of configurations

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

Example: if you are connected to Kafka link this reply to the status of the connection to the Kafka broker, so that Kubernetes will wait until the service is fully started before routing to it the traffic.

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

Example: if you are connected to Kafka link this reply to the status of the connection to the Kafka broker, so that Kubernetes will kill the pod and recreate a new one if the connection drops.

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

The time between the reception of a `SIGTERM` signal and the start of the operations for terminating the Fastify instance.  

This is due to the Kubernetes ip tables update mechanism that can take some seconds to refresh. More info [here](https://blog.laputa.io/graceful-shutdown-in-kubernetes-85f1c8d586da).

### `platformHeaders`
- Required: false

An object containing the headers keys for known platform headers.

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

An object containing the options for the httpClient instance returned by `request.getHttpClient()`.

- `additionalHeadersToProxy`
  - Required: false
  - Default: `[]`  
    The list of additional headers that the client will always automatically forward from the request.

- `disableDurationInterceptor`
  - Required: false
  - Default: `false`  
    If set to `true` disable an interceptor that register the request duration.

- `disableLogsInterceptor`
  - Required: false
  - Default: `false`  
    If set to `true` disable the logging of the outgoing HTTP request and replies.

### `disableSwagger`
- Required: false
- Default: `false`

If set to `true` it disable the swagger generation and the route that expose the OpenAPI file and the Swagger UI.

### `disableMetrics`
- Required: false
- Default: `false`

If set to `true` it disable the collection and the exposition of the metrics under the `/-/metrics` route.

### `disableRequestLogging`
- Required: false
- Default: `false`

If set to `true` it disable the routes 

### `disableStatusRoutes`
- Required: false
- Default: `false`

If set to `true` it disable the routes `/-/ready`, `/-/healthz` and `/-/check-up`.

### `disableGracefulShutdown`
- Required: false
- Default: `false`

If set to `true` it disable the listener on the `SIGTERM` signal, defaulting to the standard Fastify handling of the event.

### `disableFormBody`
- Required: false
- Default: `false`

If set to `true` it disable the `fastify-form-body` plugin.

### `disablePlatformDecorators`
- Required: false
- Default: `false`

If set to `true` it disable the functions that decorate the request and return the values for standard platform headers: `getUserId()`, `getGroups()`, `getUserProperties()` and `getClientType()`.

## Example

This is an example of configuration:

```js
await fastify.register(miaHotStart, {
  envSchema: schema,
  envSchemaOptions: {},
  logLevelEnvKey: 'LOG_LEVEL',

  customReadyRouteHandler: undefined,
  customHealthzRouteHandler: undefined,
  customCheckUpRouteHandler: undefined,
  gracefulShutdownSeconds: 10,

  platformHeaders: {
    userId: 'miauserid',
    userGroups: 'miausergroups',
    userProperties: 'miauserproperties',
    clientType: 'client-type',
  },

  httpClient: {
    additionalHeadersToProxy: [],
    disableDurationInterceptor: false,
    disableLogsInterceptor: false,
  },

  disableSwagger: false,
  disableMetrics: false,
  disableRequestLogging: false,
  disableStatusRoutes: false,
  disableGracefulShutdown: false,
  disableFormBody: false,
  disablePlatformDecorators: false,
})
```
