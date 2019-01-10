import CQL from '../index'

(async () => {
  const endpoint = 'ws://bp00.cn.gridb.io:15150'

  let cql = new CQL(endpoint)
  await cql.connect()

  console.log(cql.client.isConnected)
})()
