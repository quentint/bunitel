import Command from './Command.ts'
import CellColor from '../grid/cell/CellColor.ts'

export default class SetBackgroundColorCommand implements Command {

  constructor(public color: CellColor) {
  }

  toNumberArray(): Array<number> {
    return [27, 80 + this.color]
  }

}