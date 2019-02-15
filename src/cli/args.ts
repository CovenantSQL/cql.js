// tslint:disable:no-console no-if-statement no-expression-statement

import meow from 'meow';
import { Package, UpdateInfo, UpdateNotifier } from 'update-notifier';
import { CqliOptions } from './utils';

export async function checkArgs(): Promise<CqliOptions> {
  const cli = meow(
    `
	Usage
	  $ npx cqli

  Non-Interactive Usage
    $ npx cqli [options]

	Options
    --create-keystore, -ck      include Appveyor for Windows CI
    --recover-from-keystore, -r package.json description

    Non-Interactive Example
	  $ cqli -ck 'do something, better'
    `,
    {
      flags: {
        createKeystore: {
          default: false,
          type: 'boolean'
        },
        recoverFromKeystore: {
          default: false,
          type: 'boolean'
        },
      }
    }
  );

  // immediately check for updates every time we run cqli
  const updateInfo = await new Promise<UpdateInfo>((resolve, reject) => {
    const notifier = new UpdateNotifier({
      callback: (error, update) => {
        error ? reject(error) : resolve(update);
      },
      pkg: cli.pkg as Package
    });
    notifier.check();
  });
  if (updateInfo.type !== 'latest') {
    throw new Error(`
    Your version of cqli is outdated.
    Consider using 'npx cqli' to always get the latest version.
    `);
  }

  return {
    createKeystore: cli.flags.createKeystore,
    recoverFromKeystore: cli.flags.recoverFromKeystore,
  };
}
