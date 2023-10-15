import {Command} from './Command.ts'
import {CellColor} from '../grid/cell'

export class SetForegroundColorCommand implements Command {

  constructor(public color: CellColor) {
  }

  static consume(charCodes: Array<number>): SetForegroundColorCommand | null {

    if (charCodes[0] !== 27) {
      return null
    }

    const nextCharCode = charCodes[1]

    return nextCharCode >= 64 && nextCharCode <= 71 ?
        new SetForegroundColorCommand(CellColor[(nextCharCode - 64) as unknown as keyof typeof CellColor])
        : null
  }

  toNumberArray(): Array<number> {
    return [27, 64 + this.color]
  }

  toReadableString(): string {
    return `set foreground color: ${this.color}`
  }

}