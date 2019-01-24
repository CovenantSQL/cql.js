# cql.js

CovenantSQL's client side library

## Install

```
yarn add cql.js
```

or

```
npm i cql.js
```

## Usage

- Use `async` and `await` to handle requests

```javascript
import CQL from 'cql.js'
(async () => {
  // For existing valid websocket endpoint
  // please refer to https://developers.covenantsql.io
  const endpoint = '$COVENANT_BP_WS_ENDPOINT'
  const cql = new CQL(endpoint)

  try {
    await cql.connect()
  } catch (e) {
    console.error(e)
  }

  // connect success
  let status = await cql.bp.getRunningStatus()
  console.log('BP runing status: ', status)
})()
```

- Use promises to handle requests

```javascript
import CQL from 'cql.js'

// For existing valid websocket endpoint
// please refer to https://developers.covenantsql.io
const endpoint = '$COVENANT_BP_WS_ENDPOINT'
const cql = new CQL(endpoint)

cql
  .connect()
  .then(() => {
    // connect success
    cql.bp.getRunningStatus().then(status => {
      console.log('BP runing status: ', status)
    })
  })
  .catch(e => {
    console.error(e)
  })
```

## APIs

- `getProtocolVersion`
- `getRunningStatus`
- `getBlockList`
- `getBlockByHeight`
- `getBlockByHash`
- `getTransactionList`
- `getTransactionListOfBlock`
- `getTransactionByHas`
