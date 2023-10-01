import Command from './Command.ts'

export default class ShowCursorCommand implements Command {

  constructor(public show: boolean) {
  }

  static consume(charCodes: Array<number>): ShowCursorCommand | null {
    if (charCodes[0] === 17) {
      return new ShowCursorCommand(true)
    } else if (charCodes[0] === 20) {
      return new ShowCursorCommand(false)
    }

    return null
  }

  toNumberArray(): Array<number> {
    return [this.show ? 17 : 20]
  }

  toReadableString(): string {
    return `show cursor: ${this.show}`
  }

}