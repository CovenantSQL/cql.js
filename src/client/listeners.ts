import debugFactory, { IDebugger } from 'debug'
import { SocketMessageCallback } from './socket'

export interface ListenerObject {
  reqId: string,
  callback: SocketMessageCallback
}

export default class Listeners {
  public registerdListners: ListenerObject[] = []
  private debug: IDebugger

  constructor() {
    this.debug = debugFactory('cql:listener')
  }

  public handleMessage(message: any) {
    for (let listener of this.registerdListners) {
      if (message.id !== listener.reqId) {
        return
      }

      this.debug(
        'Found matching listener for request id [%s]',
        message.id,
        message.method
      )

      listener.callback(message)
    }
  }

  public addListener(listener: ListenerObject): void {
    this.debug('Add listener [%s]', listener.reqId)
    this.registerdListners.push(listener)
  }

  public removeListener(reqId: string): void {
    this.debug('Remove listener [%s] if exists', reqId)
    this.registerdListners = this.registerdListners.filter((
      listener: ListenerObject
    ) => {
      return reqId !== listener.reqId
    })
  }
}
