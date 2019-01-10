import CQL from '../index'

(async () => {
  // connect
  const endpoint = 'ws://bp00.cn.gridb.io:15150'
  let cql = new CQL(endpoint)
  await cql.connect()
  console.log(cql.client.isConnected)

  // bp
  let version = await cql.bp.getProtocolVersion()
  console.log(version)
  // let list = await cql.bp.getBlockList(52170, 52175)
  // console.log(list)
})()
