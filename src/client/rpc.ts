import { v1 } from 'uuid'
import WebSocket from 'isomorphic-ws'

export type RpcEventFunction = (e: Event) => void;
export type RpcMessageEventFunction = (e: MessageEvent) => void;
export type RpcCloseEventFunction = (e: CloseEvent) => void;

export type RpcNotificationEvent = (data: IRpcNotification) => void;
export type RpcRequestEvent = (data: IRpcRequest) => void;
export type RpcSuccessResponseEvent = (data: IRpcSuccessResponse) => void;
export type RpcErrorResponseEvent = (data: IRpcErrorResponse) => void;

export enum RpcVersions {
  RPC_VERSION = '2.0',
}

export type RpcId = string | number;

export interface IRpcData {
  method: string;
  params?: any;
}

export interface IRpcNotification extends IRpcData {
  jsonrpc: RpcVersions.RPC_VERSION;
}

export interface IRpcRequest extends IRpcNotification {
  // if not included its notification
  id: RpcId;
}

export interface IRpcResponse {
  id: RpcId;
  jsonrpc: RpcVersions.RPC_VERSION;
}

export interface IRpcSuccessResponse extends IRpcResponse {
  // if not included its notification
  result: any;
}

export interface IRpcError {
  code: number;
  message: string;
  data?: any;
}

export interface IRpcErrorResponse extends IRpcResponse {
  error: IRpcError;
}

export interface IRpcWebSocketConfig {
  responseTimeout: number;
}

export type RpcUnidentifiedMessage = IRpcRequest | IRpcNotification | IRpcSuccessResponse | IRpcErrorResponse;

export class RpcWebSocketClient {
  // native websocket
  public ws: WebSocket;

  private idAwaiter: {
    [id: string]: (data?: any) => void;
  } = {};

  private onOpenHandlers: RpcEventFunction[] = [];
  private onAnyMessageHandlers: RpcMessageEventFunction[] = [];

  private onNotification: RpcNotificationEvent[] = [];
  private onRequest: RpcRequestEvent[] = [];
  private onSuccessResponse: RpcSuccessResponseEvent[] = [];
  private onErrorResponse: RpcErrorResponseEvent[] = [];

  private onErrorHandlers: RpcEventFunction[] = [];
  private onCloseHandlers: RpcCloseEventFunction[] = [];

  private config = {
    responseTimeout: 10000,
  };

  // constructor
  /**
   * Does not start WebSocket connection!
   * You need to call connect() method first.
   * @memberof RpcWebSocketClient
   */
  public constructor() {
    this.ws = undefined as any;
  }

  // public
  /**
   * Starts WebSocket connection. Returns Promise when connection is established.
   * @param {string} url
   * @param {(string | string[])} [protocols]
   * @memberof RpcWebSocketClient
   */
  public async connect(url: string, protocols?: string | string[]) {
    this.ws = new WebSocket(url, protocols);
    await this.listen();
  }

  // events
  public onOpen(fn: RpcEventFunction) {
    this.onOpenHandlers.push(fn);
  }

  /**
   * Native onMessage event. DO NOT USE THIS unless you really have to or for debugging purposes.
   * Proper RPC events are onRequest, onNotification, onSuccessResponse and onErrorResponse (or just awaiting response).
   * @param {RpcMessageEventFunction} fn
   * @memberof RpcWebSocketClient
   */
  public onAnyMessage(fn: RpcMessageEventFunction) {
    this.onAnyMessageHandlers.push(fn);
  }

  public onError(fn: RpcEventFunction) {
    this.onErrorHandlers.push(fn);
  }

  public onClose(fn: RpcCloseEventFunction) {
    this.onCloseHandlers.push(fn);
  }

  /**
   * Appends onmessage listener on native websocket with RPC handlers.
   * If onmessage function was already there, it will call it on beggining.
   * Useful if you want to use RPC WebSocket Client on already established WebSocket along with function changeSocket().
   * @memberof RpcWebSocketClient
   */
  public listenMessages() {
    let previousOnMessage: RpcEventFunction | undefined;
    if (this.ws.onmessage) {
      previousOnMessage = this.ws.onmessage.bind(this.ws);
    }

    this.ws.onmessage = (e: MessageEvent) => {
      if (previousOnMessage) {
        previousOnMessage(e);
      }

      for (const handler of this.onAnyMessageHandlers) {
        handler(e);
      }

      const data: RpcUnidentifiedMessage = JSON.parse(e.data);
      if (this.isNotification(data)) {
        // notification
        for (const handler of this.onNotification) {
          handler(data);
        }
      } else if (this.isRequest(data)) {
        // request
        for (const handler of this.onRequest) {
          handler(data);
        }
        // responses
      } else if (this.isSuccessResponse(data)) {
        // success
        for (const handler of this.onSuccessResponse) {
          handler(data);
        }

        // resolve awaiting function
        this.idAwaiter[data.id](data.result);
      } else if (this.isErrorResponse(data)) {
        // error
        for (const handler of this.onErrorResponse) {
          handler(data);
        }

        // resolve awaiting function
        this.idAwaiter[data.id](data.error);
      }
    };
  }

  // communication

  /**
   * Creates and sends RPC request. Resolves when appropirate response is returned from server or after config.responseTimeout.
   * @param {string} method
   * @param {*} [params]
   * @returns
   * @memberof RpcWebSocketClient
   */
  public call(method: string, params?: any) {
    return new Promise((resolve, reject) => {
      const data = this.buildRequest(method, params);

      // give limited time for response
      let timeout: NodeJS.Timeout;
      if (this.config.responseTimeout) {
        timeout = setTimeout(() => {
          // stop waiting for response
          delete this.idAwaiter[data.id];
          reject(`Awaiting response to: ${method} with id: ${data.id} timed out.`);
        }, this.config.responseTimeout);
      }

      // expect response
      this.idAwaiter[data.id] = (responseData?: any) => {
        // stop timeout
        clearInterval(timeout);
        // stop waiting for response
        delete this.idAwaiter[data.id];

        if (this.isRpcError(responseData)) {
          reject(responseData);
          return;
        }

        resolve(responseData);
      };

      this.ws.send(JSON.stringify(data));
    });
  }

  /**
   * Creates and sends RPC Notification.
   * @param {string} method
   * @param {*} [params]
   * @memberof RpcWebSocketClient
   */
  public notify(method: string, params?: any) {
    this.ws.send(JSON.stringify(this.buildNotification(method, params)));
  }

  // setup

  /**
   * You can provide custom id generation function to replace default uuid/v1.
   * @param {() => string} idFn
   * @memberof RpcWebSocketClient
   */
  public customId(idFn: () => string) {
    this.idFn = idFn;
  }

  /**
   * Allows modifying configuration.
   * @param {RpcWebSocketConfig} options
   * @memberof RpcWebSocketClient
   */
  public configure(options: any) {
    Object.assign(this.config, options);
  }

  /**
   * Allows you to change used native WebSocket client to another one.
   * If you have already-connected WebSocket, use this with listenMessages().
   * @param {WebSocket} ws
   * @memberof RpcWebSocketClient
   */
  public changeSocket(ws: WebSocket) {
    this.ws = ws;
  }

  // private

  // events
  private listen() {
    return new Promise((resolve, reject) => {
      this.ws.onopen = (e: Event) => {
        for (const handler of this.onOpenHandlers) {
          handler(e);
        }
        resolve();
      };

      // listen for messages
      this.listenMessages();

      // called before onclose
      this.ws.onerror = (e: Event) => {
        for (const handler of this.onErrorHandlers) {
          handler(e);
        }
      };

      this.ws.onclose = (e: CloseEvent) => {
        for (const handler of this.onCloseHandlers) {
          handler(e);
        }
        reject();
      };
    });
  }

  // request
  private buildRequest(method: string, params?: any): IRpcRequest {
    const data = this.buildRequestBase(method, params);
    data.jsonrpc = RpcVersions.RPC_VERSION;
    return data;
  }

  private buildRequestBase(method: string, params?: any): IRpcRequest {
    const data: IRpcRequest = {} as any;
    data.id = this.idFn();
    data.method = method;

    if (params) {
      data.params = params;
    }

    return data;
  }

  // notification
  private buildNotification(method: string, params?: any): IRpcNotification {
    const data = this.buildNotificationBase(method, params);
    data.jsonrpc = RpcVersions.RPC_VERSION;
    return data;
  }

  private buildNotificationBase(method: string, params?: any): IRpcNotification {
    const data: IRpcNotification = {} as any;
    data.method = method;

    if (params) {
      data.params = params;
    }

    return data;
  }

  private idFn(): RpcId {
    return v1();
  }

  // tests
  private isNotification(data: RpcUnidentifiedMessage): data is IRpcNotification {
    return !(data as any).id;
  }

  private isRequest(data: RpcUnidentifiedMessage): data is IRpcRequest {
    return (data as any).method;
  }

  private isSuccessResponse(data: RpcUnidentifiedMessage): data is IRpcSuccessResponse {
    return data.hasOwnProperty(`result`);
  }

  private isErrorResponse(data: RpcUnidentifiedMessage): data is IRpcErrorResponse {
    return data.hasOwnProperty(`error`);
  }

  private isRpcError(data: any): data is IRpcError {
    return typeof (data as any).code !== 'undefined';
  }
}

export default RpcWebSocketClient;
