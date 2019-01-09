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
