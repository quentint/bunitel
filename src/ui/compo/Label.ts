import DisplayObject from '../DisplayObject.ts'
import AbstractCellGrid from '../../grid/AbstractCellGrid.ts'
import CharacterCell from '../../grid/cell/CharacterCell.ts'
import CellColor from '../../grid/cell/CellColor.ts'
import GhostCell from '../../grid/cell/GhostCell.ts'

export default class Label extends DisplayObject {

  public doubleWidth: boolean = false
  public doubleHeight: boolean = false
  public color: CellColor = CellColor.DEFAULT_FOREGROUND
  public invert: boolean = false
  public blink: boolean = false
  public underline: boolean = false

  constructor(private _text: string = '') {
    super()
  }

  public set text(text: string) {
    this._text = text
    this.requestStageUpdate()
  }

  public get text(): string {
    return this._text
  }

  protected getSelfGrid(): AbstractCellGrid {
    const grid = new AbstractCellGrid()

    if (this.underline) {
      if (this.getStageCoordinates().x < 1) {
        console.warn('Label with underline should not be placed on the left of the screen, style will be ignored')
      }

      const underlineCell = new CharacterCell(' ')
      underlineCell.underline = true
      grid.set(-1, 0, underlineCell)
    }

    this.text.split('').forEach((char, index) => {
      const cell = new CharacterCell(char)
      cell.doubleWidth = this.doubleWidth
      cell.doubleHeight = this.doubleHeight
      cell.color = this.color
      cell.invert = this.invert
      cell.blink = this.blink
      cell.underline = this.underline

      let targetX = index * (this.doubleWidth ? 2 : 1)

      if (this.doubleWidth) {
        grid.set(targetX + 1, 0, new GhostCell())
      }

      grid.set(targetX, 0, cell)
    })

    if (this.doubleHeight) {
      for (let x: number = 0; x < grid.innerWidth; x++) {
        grid.set(x, -1, new GhostCell())
      }
    }

    return grid
  }
}