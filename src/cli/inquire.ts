import { prompt, Question } from 'inquirer'
import { CqliOptions, underlineChalk } from './utils'

export async function inquireKeystore(): Promise<CqliOptions> {
  enum KeystoreActions {
    create = 'create',
    recover = 'recover'
  }
  const keystoreActionQuestion: Question = {
    // tslint:disable-next-line:readonly-array
    choices: [
      { name: 'create a new keystore', value: KeystoreActions.create },
      { name: 'recover from an existing keystore', value: KeystoreActions.recover }
    ],
    message: `${underlineChalk('Keyvenant')}\n🔑 What do you need with the keystore tool?`,
    name: 'keystoreAction',
    type: 'list'
  }

  return prompt([
    keystoreActionQuestion,
  ]).then(answers => {
    const {
      projectName,
      keystoreAction,
    } = answers as {
      readonly projectName: string
      readonly keystoreAction: KeystoreActions
    }

    return {
      projectName,
      keystoreAction,
    }
  })
}
