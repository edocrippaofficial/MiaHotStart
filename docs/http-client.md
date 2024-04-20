# HTTP Client

The Fastify request is decorated with the function `getHttpClient()` that returns an instance of `Axios`.

The signature of the function is the following:

```ts
getHttpClient(baseUrl: string, baseOptions?: CreateAxiosDefaults): AxiosInstance
```

## What are the benefits over a normal instance of Axios?

The instance returned by this method has some benefits over a standard instance:

- it is already setup to forward useful headers:
  - the platform headers
  - the request id
  - a set of headers defined as an option of the plugin itself
- it is decorated with useful interceptors

## Interceptors

There are two interceptor applied by default. They can be disabled using the `disableDurationInterceptor` and `disableLogsInterceptor`. Check out the [config section](config.md#httpclient) for more information.

### Logging interceptors

This interceptor uses the logger attached to the Request to log the request input and the response output (either if the promise call is fulfilled or rejected).  
The log level is set to `trace`.

### Response time interceptors

This interceptor adds the `duration` property to the Axios reply. It stores the milliseconds used by the HTTP request to complete.

### Add custom interceptors

If you want to add a custom interceptors to your instance of Axios just add to the instance returned by the function `getHttpClient` as explained in the [Axios documentation](https://axios-http.com/docs/interceptors).

You can also create a `factory` function that will return the Axios instance already decorated with the interceptor if you plan to use it multiple times:

```js
function createHttpClient(request, baseUrl, baseOptions) {
  const axios = request.getHttpClient(baseUrl, baseOptions)
  axios.interceptors.request.use(function (config) {
    ...
  })

  return axios
}

fastify.get('/', async function(request, reply) {
  const axios = createHttpClient(request, baseUrl, baseOptions)
  
  // Use the Axios instance with the interceptor
  axios.get(...)
})
```
