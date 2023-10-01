import Command from './Command.ts'

export default class MoveToAbsoluteCommand implements Command {

  constructor(public x: number, public y: number) {
  }

  static consume(charCodes: Array<number>): MoveToAbsoluteCommand | null {
    return charCodes[0] === 31 ?
        new MoveToAbsoluteCommand(charCodes[2] - 64 - 1, charCodes[1] - 64 - 1)
        : null
  }

  toNumberArray(): Array<number> {
    return [31, 64 + this.y + 1, 64 + this.x + 1]
  }

  toReadableString(): string {
    return `move to absolute ${this.x}, ${this.y}`
  }
}