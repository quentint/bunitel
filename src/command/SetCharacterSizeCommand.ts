import Command from './Command.ts'

export default class SetCharacterSizeCommand implements Command {
  constructor(public doubleWidth: boolean, public doubleHeight: boolean) {
  }

  static consume(charCodes: Array<number>): SetCharacterSizeCommand | null {

    if (charCodes[0] !== 27) {
      return null
    }

    const nextCharCode = charCodes[1] - 76

    return nextCharCode >= 0 && nextCharCode <= 3 ?
        new SetCharacterSizeCommand(nextCharCode === 2 || nextCharCode === 3, nextCharCode === 1 || nextCharCode === 3)
        : null
  }

  toNumberArray(): Array<number> {
    return [27, 76 + (this.doubleHeight ? 1 : 0) + (this.doubleWidth ? 2 : 0)]
  }

  toReadableString(): string {
    return 'set character size to ' + (this.doubleWidth ? 'double width' : 'normal width') + ' and ' + (this.doubleHeight ? 'double height' : 'normal height')
  }
}