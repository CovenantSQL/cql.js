export interface RPCObject {
  jsonrpc: string
  method: string
  params: Array<any>
  id: string | number
}

export const constructRPCObj = (
  method: string,
  params: Array<any> = []
): RPCObject => {
  return {
    jsonrpc: '2.0',
    method,
    params,
    id: generateRandomId()
  }
}

const generateRandomId = (): string => {
  return `cql${Math.random().toString(16).substr(4)}`
}
