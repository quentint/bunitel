import {Command} from './Command.ts'

export class MoveToRelativeCommand implements Command {

  constructor(public x: number, public y: number) {
  }

  static consume(charCodes: Array<number>): MoveToRelativeCommand | null {
    if (charCodes[0] !== 27 || charCodes[1] !== 91) {
      return null
    }

    const val = charCodes[2]
    const dirChar: string = String.fromCharCode(charCodes[3])
    if (dirChar !== 'A' && dirChar !== 'B' && dirChar !== 'C' && dirChar !== 'D') {
      return null
    }

    const x = dirChar === 'C' ? -val : dirChar === 'D' ? val : 0
    const y = dirChar === 'B' ? -val : dirChar === 'A' ? val : 0

    return new MoveToRelativeCommand(x, y)
  }

  toNumberArray(): Array<number> {
    const ar: Array<number> = []

    // TODO: Implement short moves (VT, LF, BS, TAB)

    if (this.y !== 0) {
      ar.push(27, 91, this.y, (this.y < 0 ? 'B' : 'A').charCodeAt(0))
    }

    if (this.x !== 0) {
      ar.push(27, 91, this.x, (this.x < 0 ? 'C' : 'D').charCodeAt(0))
    }

    return ar
  }

  toReadableString(): string {
    return `move to relative ${this.x}, ${this.y}`
  }
}