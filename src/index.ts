import WebSocketClient, { CqlWebSocket } from './client/socket'
import * as Bp from './libs/bp'

export default class CQL {
  public client: CqlWebSocket
  public Bp: any
  public options?: object

  constructor(
    apiNodeEndpoint: string,
    options?: object
  ) {
    this.client = new WebSocketClient(apiNodeEndpoint)
    this.options = options
    this.Bp = Bp
  }

  public connect(): Promise<any> {
    return this.client.connect()
  }
}
