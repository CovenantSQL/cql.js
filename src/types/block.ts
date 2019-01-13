export interface Block {
  height: number
  hash: string
  timestamp: string
  timestamp_human: string
  version: number
  producer: string
  parent: string
  tx_count: number
}
