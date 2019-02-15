// tslint:disable:no-expression-statement no-console
import chalk from 'chalk'
import { checkArgs, showHelp } from './args'
import { inquireKeystore } from './inquire'
import { getIntro, CqliOptions, hasCliOptions } from './utils'

(async () => {
  const argInfo = await checkArgs()
  const options: CqliOptions = hasCliOptions(argInfo)
    ? argInfo
    : {
      ...(await (async () => {
        console.log(getIntro())
        showHelp(0)
        return null
      })()),
      ...(argInfo as {})
    }

  // following logic base on current options and inputs
  if (options.keystore) {
    inquireKeystore()
  }
})().catch((err: Error) => {
  console.error(`
  ${chalk.red(err.message)}
`)
  process.exit(1)
})
