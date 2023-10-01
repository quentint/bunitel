import Command from './Command.ts'
import CellMode from '../grid/cell/CellMode.ts'

export default class SetCharacterModeCommand implements Command {

  constructor(public mode: CellMode) {
  }

  toNumberArray(): Array<number> {
    return [this.mode]
  }

}