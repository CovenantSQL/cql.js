import debugFactory, { IDebugger } from 'debug'
import { CqlWebSocket } from '../client/socket'
import { RPCObject, constructRPCObj } from '../client/rpc'

export interface BpInterface {
  // getProtocolVersion(): Promise<any>
  // getRunningStatus(): Promise<any>
  getBlockList(from: number, to: number): Promise<Array<object>>
  // getBlockListByTimeRange(): Promise<any>
  // getBlockByHeight(): Promise<any>
  // getBlockByHash(): Promise<any>
  // getTransactionListOfBlock(): Promise<any>
  // getTransactionByHash(): Promise<any>
}

export enum BpMethodType {
  GET_BLOCK_LIST = 'bp_getBlockList'
}

export default class Bp implements BpInterface {
  public client: CqlWebSocket

  private debug: IDebugger

  constructor (
    client: CqlWebSocket
  ) {
    this.client = client
    this.debug = debugFactory('cql:bp')
  }

  public getBlockList(from: number, to: number): Promise<Array<object>> {
    let params = [from, to]
    let req: RPCObject = constructRPCObj(BpMethodType.GET_BLOCK_LIST, params)

    this.debug('getBlockList of ', req)
    return new Promise((resolve) => {
      this.client.send(req, (res) => {
        this.debug('get response', res)
        if (res.id === req.id) {
          resolve(res.result)
        }
      })
    })
  }
}
