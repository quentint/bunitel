import {Command} from './Command.ts'

export class AddStringCommand implements Command {

  constructor(public s: string) {
  }

  static consume(charCodes: Array<number>): AddStringCommand {
    return new AddStringCommand(String.fromCharCode(charCodes[0]))
  }

  toNumberArray(): Array<number> {
    return this.s.split('').map(c => c.charCodeAt(0))
  }

  toReadableString(): string {
    return `add string: '${this.s}'`
  }

}