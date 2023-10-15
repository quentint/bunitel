import {Command} from './Command.ts'
import {CellColor} from '../grid/cell'

export class SetBackgroundColorCommand implements Command {

  constructor(public color: CellColor) {
  }

  static consume(charCodes: Array<number>): SetBackgroundColorCommand | null {

    if (charCodes[0] !== 27) {
      return null
    }

    const nextCharCode = charCodes[1]

    return nextCharCode >= 80 && nextCharCode <= 87 ?
        new SetBackgroundColorCommand(CellColor[(nextCharCode - 80) as unknown as keyof typeof CellColor])
        : null
  }

  toNumberArray(): Array<number> {
    return [27, 80 + this.color]
  }

  toReadableString(): string {
    return `set background color: ${this.color}`
  }

}