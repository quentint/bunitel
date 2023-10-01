import Command from './Command.ts'
import CellMode from '../grid/cell/CellMode.ts'

export default class SetCharacterModeCommand implements Command {

  constructor(public mode: CellMode) {
  }

  static consume(charCodes: Array<number>): SetCharacterModeCommand | null {
    return charCodes[0] === CellMode.STANDARD || charCodes[0] === CellMode.MOSAIC ?
        new SetCharacterModeCommand(charCodes[0])
        : null
  }

  toNumberArray(): Array<number> {
    return [this.mode]
  }

  toReadableString(): string {
    return `set character mode to ${this.mode === CellMode.STANDARD ? 'standard' : 'mosaic'}`
  }

}