import WebSocketClient, { CqlWebSocket } from './client/socket'
import Bp from './libs/bp'

export default class CQL {
  public client: CqlWebSocket
  public bp: Bp
  public options?: object

  constructor(
    apiNodeEndpoint: string,
    options?: object
  ) {
    this.options = options
    this.client = new WebSocketClient(apiNodeEndpoint)
    this.bp = new Bp(this.client)
  }

  public connect(): Promise<any> {
    return this.client.connect()
  }
}
