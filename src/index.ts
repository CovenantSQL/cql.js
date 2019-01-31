import RPCClient, { CqlClient } from './client'
import Keystore from './libs/keystore'
import Bp from './libs/bp'

export default class CQL {
  public client: CqlClient
  public bp: Bp
  public options?: object
  public keystore?: any

  constructor(
    apiNodeEndpoint: string,
    options?: object
  ) {
    this.options = options
    this.client = new RPCClient(apiNodeEndpoint)
    this.bp = new Bp(this.client)
    this.keystore = new Keystore()
  }

  public async connect(): Promise<any> {
    return await this.client.connect()
  }
}
