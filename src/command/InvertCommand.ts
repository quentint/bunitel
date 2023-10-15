import {Command} from './Command.ts'

export class InvertCommand implements Command {

  constructor(public active: boolean) {
  }

  static consume(charCodes: Array<number>): InvertCommand | null {

    if (charCodes[0] !== 27) {
      return null
    }

    const nextCharCode = charCodes[1]

    return nextCharCode === 92 || nextCharCode === 93 ?
        new InvertCommand(nextCharCode === 93)
        : null
  }

  toNumberArray(): Array<number> {
    return [27, this.active ? 93 : 92]
  }

  toReadableString(): string {
    return `set invert to ${this.active ? 'active' : 'inactive'}`
  }
}