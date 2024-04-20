# Prometheus Metrics

The plugin utilizes [fastify-metrics](https://github.com/SkeLLLa/fastify-metrics) to expose default and custom metrics.

The metrics are exposed by default: if you want to hide them jus pass the `disableMetrics` option to the plugin.

## How to create a new metric

First, get the instance of [prom-client](https://github.com/siimon/prom-client) from the Fastify instance:

```js
const promClient = fastify.metrics.client
```

Then you can create a custom metric and assigning it to a variable:

```js
const customMetric = new promClient.Counter({
  name: 'custom_metric',
  help: 'This is a custom metric',
  labelNames: ['foo'],
})
```

Now you can utilize the metric as an instance of `Counter` in the `prom-client` library:

```js
customMetric.labels({ foo: 'bar' }).inc(10)
```

You can also decorate the Request instance with the metric in order to utilize it in the handler:
```js
fastify.addHook('onRequest', async(request) => {
  request.customMetric = customMetric
})
```

Check the [example](../example) for more information.
