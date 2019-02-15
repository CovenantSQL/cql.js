import chalk from 'chalk';
import gradient from 'gradient-string';
import _ from 'lodash'

export interface CqliOptions {
  readonly createKeystore: boolean;
  readonly recoverFromKeystore: boolean;
}

export function hasCliOptions(
  opts: CqliOptions
): opts is CqliOptions {
  return _.compact(_.values(opts)).length > 0
}

export function getIntro(columns: number | undefined): string {
  const ascii = `
   ___                                        _    __    ____   __
  / __\\ ___ __   __ ___  _ __    __ _  _ __  | |_ / _\\  /___ \\ / /
 / /   / _ \\\\ \\ / // _ \\| '_ \\  / _\` || '_ \\ | __|\\ \\  //  / // /
/ /___| (_) |\\ V /|  __/| | | || (_| || | | || |_ _\\ \\/ \\_/ // /___
\\____/ \\___/  \\_/  \\___||_| |_| \\__,_||_| |_| \\__|\\__/\\___,_\\\\____/
`;

  const asciiSmaller = `
   ___                                 _   __   ____  __
  / __\\_____   _____ _ __   __ _ _ __ | |_/ _\\ /___ \\/ /
 / /  / _ \\ \\ / / _ | '_ \\ / _\` | '_ \\| __\\ \\ //  / / /
/ /__| (_) \\ V |  __| | | | (_| | | | | |__\\ / \\_/ / /___
\\____/\\___/ \\_/ \\___|_| |_|\\__,_|_| |_|\\__\\__\\___,_\\____/
`;

  return columns && columns >= 85
    ? chalk.bold(gradient.mind(ascii))
    : columns && columns >= 74
      ? chalk.bold(gradient.mind(asciiSmaller))
      : `\n${chalk.cyan.bold.underline('CovenantSQL client cli - cqli')}\n`;
}
