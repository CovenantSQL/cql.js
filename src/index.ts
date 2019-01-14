import WebSocketClient, { CqlWebSocket } from './client/socket'
import Keystore from './libs/keystore'
import Bp from './libs/bp'

export default class CQL {
  public client: CqlWebSocket
  public bp: Bp
  public options?: object
  public keystore?: any

  constructor(
    apiNodeEndpoint: string,
    options?: object
  ) {
    this.options = options
    this.client = new WebSocketClient(apiNodeEndpoint)
    this.bp = new Bp(this.client)
    this.keystore = new Keystore()
  }

  public connect(): Promise<any> {
    return this.client.connect()
  }
}
