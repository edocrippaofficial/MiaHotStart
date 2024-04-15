# Mia Hot Start

[![javascript style guide][standard-mia-svg]][standard-mia]
[![NPM version][npmjs-svg]][npmjs-com]


A very opinionated Fastify Plugin to kickstart your project.

## Getting Started

### Install

To install the package you can run:

```sh
npm install mia-hot-start
```

### Usage

To use the plugin just register it after the instantiation of a Fastify instance
```js
import MiaHotStart from 'mia-hot-start'

const schema = {
  type: 'object',
  properties: {
    HTTP_PORT: { type: 'number', default: 3000 },
    LOG_LEVEL: { type: 'string', default: 'trace' },
  },
}

const fastify = Fastify()
await fastify.register(MiaHotStart, {
  envSchema: schema,
  logLevelEnvKey: 'LOG_LEVEL',
})
```

## Functionalities
The plugin provides you out of the box:
- env schema handling via [fastify-env](...)
- logging enhancement
- metrics exposed to Prometheus via [fastify-metrics](...)
- graceful shutdown catching the Kubernetes signals
- status routes for Kubernetes
- OpenAPI spec generation and a Swagger Viewer via [fastify-swagger](..) and [fastify-swagger-ui](...)
- an HTTP client based on [Axios](..) with pre-built handling of platform headers and logging
- handling of platform headers via Fastify request decorators

[standard-mia-svg]: https://img.shields.io/badge/code_style-standard--mia-orange.svg
[standard-mia]: https://github.com/mia-platform/eslint-config-mia
[npmjs-svg]: https://img.shields.io/npm/v/mia-hot-start.svg?logo=npm&color=lightgreen
[npmjs-com]: https://www.npmjs.com/package/mia-hot-start
