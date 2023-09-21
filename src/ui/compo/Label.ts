import DisplayObject from '../DisplayObject.ts'
import AbstractCellGrid from '../../grid/AbstractCellGrid.ts'
import CharacterCell from '../../grid/cell/CharacterCell.ts'
import CellColor from '../../grid/cell/CellColor.ts'
import GhostCell from '../../grid/cell/GhostCell.ts'

export default class Label extends DisplayObject {

  public doubleWidth: boolean = false
  public doubleHeight: boolean = false
  public color: CellColor = CellColor.WHITE_100
  public invert: boolean = false
  public blink: boolean = false

  constructor(public text: string) {
    super()
  }

  protected getSelfGrid(): AbstractCellGrid {
    const grid = new AbstractCellGrid()

    this.text.split('').forEach((char, index) => {
      const cell = new CharacterCell(char)
      cell.doubleWidth = this.doubleWidth
      cell.doubleHeight = this.doubleHeight
      cell.color = this.color
      cell.invert = this.invert
      cell.blink = this.blink

      let targetX = index * (this.doubleWidth ? 2 : 1)

      if (this.doubleWidth) {
        grid.set(targetX + 1, 0, new GhostCell())
      }

      grid.set(targetX, 0, cell)
    })

    if (this.doubleHeight) {
      for (let x: number = 0; x < grid.width; x++) {
        grid.set(x, -1, new GhostCell())
      }
    }

    return grid
  }
}