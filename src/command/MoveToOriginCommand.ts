import Command from './Command.ts'

export default class MoveToOriginCommand implements Command {

  static consume(charCodes: Array<number>): MoveToOriginCommand | null {
    return charCodes[0] === 30 ? new MoveToOriginCommand() : null
  }

  toNumberArray(): Array<number> {
    return [30]
  }

  toReadableString(): string {
    return `move to origin`
  }

}