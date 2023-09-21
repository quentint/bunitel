import DisplayObject from '../DisplayObject.ts'
import AbstractCellGrid from '../../grid/AbstractCellGrid.ts'
import CellColor from '../../grid/cell/CellColor.ts'
import MosaicCell from '../../grid/cell/MosaicCell.ts'

export default class MosaicLabel extends DisplayObject {

  public foregroundColor: CellColor = CellColor.WHITE_100
  public backgroundColor: CellColor = CellColor.BLACK_0
  public blink: boolean = false

  constructor(public text: string) {
    super()
  }

  protected getSelfGrid(): AbstractCellGrid {
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