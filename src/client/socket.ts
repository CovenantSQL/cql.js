import debugFactory, { IDebugger } from 'debug'
import WebSocket from 'isomorphic-ws'

export interface CqlWebSocket {
  url: string
  isConnected: boolean

  connect(): Promise<void>
  disconnect(): Promise<void>

  // send(message: any): Promise<boolean>
}

export default class WebSocketClient implements CqlWebSocket {
  public url: string
  public isConnected: boolean = false
  public socket?: any

  private connectionPromise?: Promise<void>
  private debug: IDebugger

  public constructor(url) {
    this.url = url
    this.debug = debugFactory('cqlws:socket')
  }

  public async connect(): Promise<void> {
    this.debug('About to connect to remote API node ws endpoint')

    if (this.connectionPromise !== undefined) {
      return this.connectionPromise
    }

    this.connectionPromise = new Promise<void>((resolve, reject) => {
      this.debug('Connection promise start, creating and opening socket')

      try {
        this.socket = new WebSocket(this.url)
        this.socket.onopen = () => {
          this.isConnected = true
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
    this.socket.onopen = this.noop
    this.socket.onclose = this.noop
    this.socket.onerror = this.noop
    this.socket.onmessage = this.noop
    this.socket = undefined
    this.isConnected = false
  }

  public async send(message: any): Promise<boolean> {
    // TODO
    if (!this.isConnected) {
      this.debug('Connection lost, re-connecting')
      // await this.reconnect()
    }

    if (!this.isConnected) {
      this.debug('No established connection, abort sending')
      return false
    }

    this.debug('Sending message: ', message)
    try {
      this.socket!.send(JSON.stringify(message))
    } catch (error) {
      return false
    }
    return true
  }

  private noop = ():void => { return }
}
