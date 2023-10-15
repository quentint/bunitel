import {Command} from './Command.ts'

export class UnderlineCommand implements Command {

  constructor(public active: boolean) {
  }

  static consume(charCodes: Array<number>): UnderlineCommand | null {

    if (charCodes[0] !== 27) {
      return null
    }

    const nextCharCode = charCodes[1]

    return nextCharCode === 89 || nextCharCode === 90 ?
        new UnderlineCommand(nextCharCode === 90)
        : null
  }

  toNumberArray(): Array<number> {
    return [27, this.active ? 90 : 89]
  }

  toReadableString(): string {
    return `set underline to ${this.active ? 'active' : 'inactive'}`
  }
}