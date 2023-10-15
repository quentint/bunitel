import {Command} from './Command.ts'

export class BeepCommand implements Command {

  static consume(charCodes: Array<number>): BeepCommand | null {
    return charCodes[0] === 7 ? new BeepCommand() : null
  }

  toNumberArray(): Array<number> {
    return [7]
  }

  toReadableString(): string {
    return `beep`
  }

}