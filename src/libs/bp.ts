import debugFactory, { IDebugger } from 'debug'
import { CqlClient } from '../client'
// import { RPCObject, constructRPCObj } from '../client/rpc'

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
  public client: CqlClient

  private debug: IDebugger

  constructor(
    client: CqlClient
  ) {
    this.client = client
    this.debug = debugFactory('cql:bp')
  }

  public async getProtocolVersion(): Promise<string> {
    let method = BpMethodType.GET_PROTOCOL_VERSION
    this.debug('Send getProtocolVersion request', method)

    let result = await this.client.call(method)
    this.debug('Got getProtocolVersion response', result)

    return result
  }

  public async getRunningStatus(): Promise<object> {
    let method = BpMethodType.GET_RUNNING_STATUS
    this.debug('Send getRunningStatus request', method)

    let result = await this.client.call(method)
    this.debug('Got getRunningStatus response', result)

    return result
  }

  public async getBlockList(
    page: number,
    size: number,
    since: number = 0
  ): Promise<object> {
    let params = [since, page, size]
    let method = BpMethodType.GET_BLOCK_LIST
    this.debug('Send getBlockList request', method, params)

    let result = await this.client.call(method, params)
    this.debug('Got getBlockList response', result)

    return result
  }

  public async getBlockByHeight(
    height: number
  ): Promise<object> {
    let params = [height]
    let method = BpMethodType.GET_BLOCK_BY_HEIGHT
    this.debug('Send getBlockByHeight request', method, params)

    let result = await this.client.call(method, params)
    this.debug('Got getBlockByHeight response', result)

    return result
  }

  public async getBlockByHash(
    hash: string
  ): Promise<object> {
    let params = [hash]
    let method = BpMethodType.GET_BLOCK_BY_HASH
    this.debug('Send getBlockByHash request', method, params)

    let result = await this.client.call(method, params)
    this.debug('Got getBlockByHash response', result)

    return result
  }

  public async getTransactionList(
    page: number,
    size: number,
    since: string = ''
  ): Promise<object> {
    let params = [since, page, size]
    let method = BpMethodType.GET_TRANSACTION_LIST
    this.debug('Send getTransactionList request', method, params)

    let result = await this.client.call(method, params)
    this.debug('Got getTransactionList response', result)

    return result
  }

  public async getTransactionListOfBlock(
    height: number,
    from: number,
    to: number
  ): Promise<Array<object>> {
    let params = [height, from, to]
    let method = BpMethodType.GET_TRANSACTION_LIST_OF_BLOCK
    this.debug('Send getTransactionListOfBlock request', method, params)

    let result = await this.client.call(method, params)
    this.debug('Got getTransactionListOfBlock response', result)

    return result
  }

  public async getTransactionByHash(
    hash: string
  ): Promise<object> {
    let params = [hash]
    let method = BpMethodType.GET_TRANSACTION_BY_HASH
    this.debug('Send getTransactionByHash request', method, params)

    let result = await this.client.call(method, params)
    this.debug('Got getTransactionByHash response', result)

    return result
  }
}
