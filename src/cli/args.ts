// tslint:disable:no-console no-if-statement no-expression-statement

import meow from 'meow'
import { Package, UpdateInfo, UpdateNotifier } from 'update-notifier'
import { CqliOptions } from './utils'

const cli = meow(
  `
Usage
  $ npx cqli

Non-Interactive Usage
  $ npx cqli [options] <input>

Options
  --keystore, -k      create keystore or recover from keystore

  Non-Interactive Example
  $ cqli --k
  `,
  {
    flags: {
      keystore: {
        alias: 'k',
        default: false,
        type: 'boolean'
      },
    }
  }
)

export async function checkArgs(): Promise<CqliOptions> {
  // immediately check for updates every time we run cqli
  await checkUpdate(cli.pkg)

  return {
    keystore: cli.flags.keystore
  }
}

export const showHelp = cli.showHelp

async function checkUpdate(pkg: Package) {
  const updateInfo = await new Promise<UpdateInfo>((resolve, reject) => {
    const notifier = new UpdateNotifier({
      callback: (error, update) => {
        error ? reject(error) : resolve(update)
      },
      pkg
    })
    notifier.check()
  })
  if (updateInfo.type !== 'latest') {
    throw new Error(`
    Your version of cqli is outdated.
    Consider using 'npx cqli' to always get the latest version.
    `)
  }
}
