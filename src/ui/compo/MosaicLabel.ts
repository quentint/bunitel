import {DisplayObject} from '../DisplayObject.ts'
import {AbstractCellGrid} from '../../grid'
import {CellColor} from '../../grid/cell'
import {MosaicCell} from '../../grid/cell'

export class MosaicLabel extends DisplayObject {

  public foregroundColor: CellColor = CellColor.DEFAULT_FOREGROUND
  public backgroundColor: CellColor = CellColor.DEFAULT_BACKGROUND
  public blink: boolean = false

  constructor(public text: string) {
    super()
  }

  public getSelfGrid(): AbstractCellGrid {
    const grid = new AbstractCellGrid()

    this.text.split('').forEach((char, index) => {
      const cell = new MosaicCell(char)
      cell.foregroundColor = this.foregroundColor
      cell.backgroundColor = this.backgroundColor
      cell.blink = this.blink

      grid.set(index, 0, cell)
    })

    return grid
  }
}