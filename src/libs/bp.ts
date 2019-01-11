import debugFactory, { IDebugger } from 'debug'
import { CqlWebSocket } from '../client/socket'
import { RPCObject, constructRPCObj } from '../client/rpc'

export interface BpInterface {
  getProtocolVersion(): Promise<string>
  getRunningStatus(): Promise<object>
  getBlockList(page: number, size: number, since: number): Promise<object>
  // getBlockListByTimeRange(): Promise<any>
  getBlockByHeight(height: number): Promise<object>
  getBlockByHash(hash: string): Promise<object>
  getTransactionList(page: number, size: number, since: string): Promise<object>
  getTransactionListOfBlock(height: number, from: number, to: number): Promise<Array<object>>
  getTransactionByHash(hash: string): Promise<object>
}

export enum BpMethodType {
  GET_PROTOCOL_VERSION = 'bp_getProtocolVersion',
  GET_RUNNING_STATUS = 'bp_getRunningStatus',
  GET_BLOCK_LIST = 'bp_getBlockList',
  // GET_BLOCK_LIST_BY_TIME_RANGE = 'bp_getBlockListByTimeRange',
  GET_BLOCK_BY_HEIGHT = 'bp_getBlockByHeight',
  GET_BLOCK_BY_HASH = 'bp_getBlockByHash',
  GET_TRANSACTION_LIST = 'bp_getTransactionList',
  GET_TRANSACTION_LIST_OF_BLOCK = 'bp_getTransactionListOfBlock',
  GET_TRANSACTION_BY_HASH = 'bp_getTransactionByHash'
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
    this.debug('Send getProtocolVersion request', req)
    return new Promise(resolve => {
      this.client.send(req, res => {
        this.debug('Got getProtocolVersion response', res)
        resolve(res.result)
      })
    })
  }

  public getRunningStatus(): Promise<object> {
    let req: RPCObject = constructRPCObj(BpMethodType.GET_RUNNING_STATUS)
    this.debug('Send getRunningStatus request', req)
    return new Promise(resolve => {
      this.client.send(req, res => {
        this.debug('Got getRunningStatus response', res)
        resolve(res.result)
      })
    })
  }

  public getBlockList(
    page: number,
    size: number,
    since: number = 0
  ): Promise<object> {
    let params = [since, page, size]
    let req: RPCObject = constructRPCObj(BpMethodType.GET_BLOCK_LIST, params)

    this.debug('Send getBlockList request', req)
    return new Promise((resolve) => {
      this.client.send(req, (res) => {
        this.debug('Got getBlockList response', res)
        resolve(res.result)
      })
    })
  }

  public getBlockByHeight(
    height: number
  ): Promise<object> {
    let params = [height]
    let req: RPCObject = constructRPCObj(BpMethodType.GET_BLOCK_BY_HEIGHT, params)

    this.debug('Send getBlockByHeight request', req)
    return new Promise((resolve) => {
      this.client.send(req, (res) => {
        this.debug('Got getBlockByHeight response', res)
        resolve(res.result)
      })
    })
  }

  public getBlockByHash(
    hash: string
  ): Promise<object> {
    let params = [hash]
    let req: RPCObject = constructRPCObj(BpMethodType.GET_BLOCK_BY_HASH, params)

    this.debug('Send getBlockByHash request', req)
    return new Promise((resolve) => {
      this.client.send(req, (res) => {
        this.debug('Got getBlockByHash response', res)
        resolve(res.result)
      })
    })
  }

  public getTransactionList(
    page: number,
    size: number,
    since: string = ''
  ): Promise<object> {
    let params = [since, page, size]
    let req: RPCObject = constructRPCObj(BpMethodType.GET_TRANSACTION_LIST, params)

    this.debug('Send getTransactionList request', req)
    return new Promise((resolve) => {
      this.client.send(req, (res) => {
        this.debug('Got getTransactionList response', res)
        resolve(res.result)
      })
    })
  }

  public getTransactionListOfBlock(
    height: number,
    from: number,
    to: number
  ): Promise<Array<object>> {
    let params = [height, from, to]
    let req: RPCObject = constructRPCObj(BpMethodType.GET_TRANSACTION_LIST_OF_BLOCK, params)

    this.debug('Send getTransactionListOfBlock request', req)
    return new Promise((resolve) => {
      this.client.send(req, (res) => {
        this.debug('Got getTransactionListOfBlock response', res)
        resolve(res.result)
      })
    })
  }

  public getTransactionByHash(
    hash: string
  ): Promise<object> {
    let params = [hash]
    let req: RPCObject = constructRPCObj(BpMethodType.GET_TRANSACTION_BY_HASH, params)

    this.debug('Send getTransactionByHash request', req)
    return new Promise((resolve) => {
      this.client.send(req, (res) => {
        this.debug('Got getTransactionByHash response', res)
        resolve(res.result)
      })
    })
  }
}
