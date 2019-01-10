import debugFactory, { IDebugger } from 'debug'
import { CqlWebSocket } from '../client/socket'
import { RPCObject, constructRPCObj } from '../client/rpc'

export interface BpInterface {
  getProtocolVersion(): Promise<string>
  // getRunningStatus(): Promise<any>
  getBlockList(from: number, to: number): Promise<Array<object>>
  // getBlockListByTimeRange(): Promise<any>
  // getBlockByHeight(): Promise<any>
  // getBlockByHash(): Promise<any>
  // getTransactionListOfBlock(): Promise<any>
  // getTransactionByHash(): Promise<any>
}

export enum BpMethodType {
  GET_PROTOCOL_VERSION = 'bp_getProtocolVersion',
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

  public getProtocolVersion(): Promise<string> {
    let req: RPCObject = constructRPCObj(BpMethodType.GET_PROTOCOL_VERSION)
    this.debug('Send getProtocolVersion')
    return new Promise(resolve => {
      this.client.send(req, res => {
        this.debug('Got getProtocolVersion response', res)
        resolve(res.result)
      })
    })
  }

  public getBlockList(
    from: number,
    to: number
  ): Promise<Array<object>> {
    let params = [from, to]
    let req: RPCObject = constructRPCObj(BpMethodType.GET_BLOCK_LIST, params)

    this.debug('Send getBlockList of ', req)
    return new Promise((resolve) => {
      this.client.send(req, (res) => {
        this.debug('Got getBlockList response', res)
        if (res.id === req.id) {
          resolve(res.result)
        }
      })
    })
  }
}
