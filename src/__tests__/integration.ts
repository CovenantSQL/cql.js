import CQL from '../index'
;(async () => {
  // connect
  const endpoint = 'ws://bp00.cn.gridb.io:15150'
  const cql = new CQL(endpoint)
  try {
    await cql.connect()
  } catch (e) {
    console.error(e)
  }
  console.log(cql.client.isConnected)

  // bp
  // let version = await cql.bp.getProtocolVersion()
  // console.log(version)
  // let status = await cql.bp.getRunningStatus()
  // console.log(status)
  // let list = await cql.bp.getBlockList(1, 10)
  // console.log(list)
  // let block = await cql.bp.getBlockByHeight(52170)
  // console.log(block)
  // let blockh = await cql.bp.getBlockByHash('5c075d620dd63cba04b1e887ddb805840e03b6732f81e03d058a82a15ab739f9')
  // console.log(blockh)
  // let txList = await cql.bp.getTransactionList(1, 30)
  // console.log(txList)
  // let txList = await cql.bp.getTransactionListOfBlock(52170, 0, 10)
  // console.log(txList)
  const txH = await cql.bp.getTransactionByHash('fooo')
  console.log(txH)

  // create keystore
  const keystore = cql.keystore.create('foo')
  console.log('keystore:', keystore)
})()
