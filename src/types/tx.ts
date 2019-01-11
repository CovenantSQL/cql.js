export interface Tx {
  block_height: number,
  index: number,
  hash: string,
  block_hash: string,
  timestamp: number,
  timestamp_human: string,
  type: number,
  address: string,
  raw: string,
  tx: {
    field: string
  }
}
