import Command from './Command.ts'

export default class RepeatCharacterCommand implements Command {

  constructor(public char: string, public count: number) {
  }

  static consume(charCodes: Array<number>): RepeatCharacterCommand | null {
    if (charCodes[1] === 18) {
      return new RepeatCharacterCommand(String.fromCharCode(charCodes[0]), charCodes[2] - 64 + 1)
    }

    return null
  }

  toReadableString(): string {
    return `repeat character '${this.char}' ${this.count} times`
  }

  toNumberArray(): Array<number> {
    return [this.char.charCodeAt(0), 18, 64 + this.count - 1]
  }

}