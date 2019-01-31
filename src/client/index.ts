import debugFactory, { IDebugger } from 'debug'
import { RpcWebSocketClient } from './rpc'

export interface CqlClient {
  endpoint: string
  isConnected: boolean

  connect(): Promise<void>
  call(method: string, params?: any): any
  notify(method: string, params?: any): any
}

export default class RPCClient implements CqlClient {
  public endpoint: string
  public isConnected: boolean = false
  public rpc: RpcWebSocketClient

  // debugger
  private debug: IDebugger

  constructor(endpoint) {
    this.endpoint = endpoint
    this.debug = debugFactory('cql:ws')

    this.rpc = new RpcWebSocketClient()
    this.rpc.onClose(this.reconnect)
  }

  public async connect() {
    this.debug('About to connect to remote API node ws endpoint')

    if (this.isConnected) {
      return
    }

    try {
      await this.rpc.connect(this.endpoint)
    } catch (error) {
      console.error('CovenantSQL API ws connectoin error', error)
      throw error
    }

    this.isConnected = true
    this.debug('Already init connection to remote endpoint')
  }

  public async call(
    method: string,
    params?: any
  ) {
    if (!this.isConnected && !this.endpoint) {
      this.debug('Empty endpoint and no established connection, abort sending')
      return false
    }

    this.debug('Sending message: ', JSON.stringify({ method, params }, null, 2))
    try {
      let result = await this.rpc.call(method, params)
      return result
    } catch (error) {
      console.error('CovenantSQL API ws call error', error)
      throw error
    }
  }

  public async notify(
    method: string,
    params?: any
  ) {
    if (!this.isConnected && !this.endpoint) {
      this.debug('Empty endpoint and no established connection, abort sending')
      return false
    }

    this.debug('Sending notification: ', JSON.stringify({ method, params }, null, 2))
    try {
      let result = await this.rpc.notify(method, params)
      return result
    } catch (error) {
      console.error('CovenantSQL API ws call error', error)
      throw error
    }
  }

  private reconnect() {
    if (this.endpoint === undefined) {
      this.debug('No endpoint for reconnection')
      return false
    }
    return this.connect()
  }
}
