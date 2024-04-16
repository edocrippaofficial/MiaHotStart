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



### `envSchemaOptions`
- Required: false
- Default: `{}`

### `logLevelEnvKey`
- Required: false
- Default: `LOG_LEVEL`

### `customReadyRouteHandler`
- Required: false

### `customHealthzRouteHandler`
- Required: false

### `customCheckUpRouteHandler`
- Required: false

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

