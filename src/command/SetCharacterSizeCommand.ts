import Command from './Command.ts'

export default class SetCharacterSizeCommand implements Command {
  constructor(public doubleWidth: boolean, public doubleHeight: boolean) {
  }

  toNumberArray(): Array<number> {
    return [27, 76 + (this.doubleHeight ? 1 : 0) + (this.doubleWidth ? 2 : 0)]
  }
}