// tslint:disable:no-expression-statement no-console
import chalk from 'chalk';
import { checkArgs } from './args';
// import { inquire } from './inquire';
import { getIntro, CqliOptions, hasCliOptions } from './utils';

(async () => {
  const argInfo = await checkArgs();
  const userOptions: CqliOptions = hasCliOptions(argInfo)
    ? argInfo
    : {
      ...(await (async () => {
        console.log(getIntro(process.stdout.columns));
        // return inquire();
        return null
      })()),
      ...(argInfo as {})
    };

  console.log(userOptions)
})().catch((err: Error) => {
  console.error(`
  ${chalk.red(err.message)}
`);
  process.exit(1);
});
