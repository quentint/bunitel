import {Command} from './Command.ts'

export class BlinkCommand implements Command {

  constructor(public active: boolean) {
  }

  static consume(charCodes: Array<number>): BlinkCommand | null {
    if (charCodes[0] !== 27) {
      return null
    }

    const nextCharCode = charCodes[1]

    return (nextCharCode === 72 || nextCharCode === 73) ?
        new BlinkCommand(nextCharCode === 72)
        : null
  }

  toNumberArray(): Array<number> {
    return [27, this.active ? 72 : 73]
  }

  toReadableString(): string {
    return `set blink to ${this.active ? 'active' : 'inactive'}`
  }
}