import {Command} from './Command.ts'

export class MoveToLineStartCommand implements Command {

  static consume(charCodes: Array<number>): MoveToLineStartCommand | null {
    return charCodes[0] === 13 ? new MoveToLineStartCommand() : null
  }

  toNumberArray(): Array<number> {
    return [13]
  }

  toReadableString(): string {
    return `move to line start`
  }

}