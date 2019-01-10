// tslint:disable:no-expression-statement
import test from 'ava'
import WebSocketClient from '../socket'

const ENDPOINT = 'ws://bp00.cn.gridb.io:15150'

test('connect websocket', async t => {
  let ws = new WebSocketClient(ENDPOINT)
  await ws.connect()
  t.not(ws.socket, undefined)
  t.is(ws.isConnected, true)

  await ws.disconnect()
  t.is(ws.isConnected, false)
})

test('send message', async t => {
  let client = new WebSocketClient(ENDPOINT)
  await client.connect()

  let message = {
    jsonrpc: '2.0',
    method: 'bp_getBlockList',
    params: [52170, 52175],
    id: 1
  }

  client.send(message, (res) => {
    console.log(res)

    t.not(res, undefined)
  })
  t.is(1, 1)
})
