# Get Platform Headers

The important headers to consider are:

- `userId`: the id of the user making the request
- `userGroups`: the list of groups of the user making the request
- `userProperties`: the properties of the user making the request
- `clientType`: the id of the client used by the user making the request

The plugin decorates the Request object with 4 functions that can help getting these values:

```ts
request.getUserId(): string | null
request.getGroups(): string[]
request.getUserProperties(): Object | null
request.getClientType(): string | null
```
