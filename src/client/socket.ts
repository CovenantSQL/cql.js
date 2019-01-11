import debugFactory, { IDebugger } from 'debug'
import WebSocket from 'isomorphic-ws'

import Listeners from './listeners'

export type SocketMessageCallback = (message: any) => void

export interface CqlWebSocket {
  endpoint: string
  isConnected: boolean

  connect(): Promise<void>
  disconnect(): Promise<void>

  send(message: any, cb: SocketMessageCallback): Promise<boolean>
}

export default class WebSocketClient implements CqlWebSocket {
  public endpoint: string
  public isConnected: boolean = false
  public socket?: any

  private connectionPromise?: Promise<void>
  private debug: IDebugger
  private listeners?: Listeners

  constructor(endpoint) {
    this.endpoint = endpoint
    this.debug = debugFactory('cql:ws')
  }

  public async connect(): Promise<void> {
    this.debug('About to connect to remote API node ws endpoint')

    if (this.connectionPromise !== undefined) {
      return this.connectionPromise
    }

    this.connectionPromise = new Promise<void>((resolve, reject) => {
      this.debug('Connection promise start, creating and opening socket')

      try {
        this.socket = new WebSocket(this.endpoint)
        this.socket.onmessage = this.onSocketMessage
        this.socket.onclose = this.onSocketClosed
        this.socket.onopen = () => {
          this.isConnected = true
          this.listeners = new Listeners()
          resolve()
        }
      } catch (error) {
        reject(error)
      }
    })

    this.debug('Already init connection to remote endpoint')
    return this.connectionPromise
  }

  public async disconnect(): Promise<void> {
    this.debug('About to disconnect from remote endpoint')
    if (!this.isConnected) {
      return
    }

    if (this.socket !== undefined) {
      this.debug('Socket is connected and close now')
      await this.socket.close()
    }

    this.debug('Disconnection clean up')
    this.clearClientInstance()
  }

  public async send(
    message: any,
    callback: SocketMessageCallback
  ): Promise<boolean> {
    if (!this.isConnected && !this.endpoint) {
      this.debug('Empty endpoint and no established connection, abort sending')
      return false
    }

    // reconnect
    if (!this.isConnected) {
      this.debug('Connection lost, re-connecting')
      await this.reconnect()
    }

    this.debug('Sending message: ', JSON.stringify(message, null, 2))
    try {
      this.listeners.addListener({
        reqId: message.id,
        callback
      })
      this.socket!.send(JSON.stringify(message))
    } catch (error) {
      return false
    }
    return true
  }

  private onSocketMessage = (
    event: MessageEvent
  ) => {
    let payload: any

    try {
      payload = JSON.parse(event.data) as { [key: string]: any }
    } catch (error) {
      this.debug('JSON parse fail: Covenant API node RPC response error')
      throw error
    }

    this.listeners.handleMessage(payload)
  }

  private onSocketClosed = (
    // event: MessageEvent
  ) => {
    this.clearClientInstance()
  }

  private clearClientInstance = () => {
    this.socket.onopen = this.noop
    this.socket.onclose = this.noop
    this.socket.onerror = this.noop
    this.socket.onmessage = this.noop
    this.socket = undefined
    this.listeners = undefined
    this.isConnected = false
  }

  private reconnect = async (): Promise<any> => {
    if (this.endpoint === undefined) {
      this.debug('No endpoint for reconnection')
      return false
    }
    return this.connect()
  }

  private noop = ():void => { return }
}
