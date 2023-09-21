import DisplayObject from "../DisplayObject.ts"
import DisplayMatrix from "../../types/DisplayMatrix.ts"
import Cell from "../Cell.ts"
import CellStyle from "../CellStyle.ts"

export default class Label extends DisplayObject {

  private _text: string
  private _style: CellStyle = new CellStyle()

  constructor(text: string) {
    super()
    this._text = text
  }

  get text(): string {
    return this._text
  }

  set text(value: string) {
    this._text = value
  }

  get style(): CellStyle {
    return this._style
  }

  protected getSelfMatrix(): DisplayMatrix {
    const matrix = {0: {}}

    this.text.split('').forEach((char, index) => {
      const cell = new Cell()
      cell.char = char
      cell.style = this.style/*.clone()*/

      let targetX = index * (this.style.doubleWidth ? 2 : 1);
      matrix[0][targetX] = cell

      if (this.style.doubleWidth) {
        const ghostCell = new Cell()
        ghostCell.isGhost = true

        matrix[0][targetX + 1] = ghostCell
      }
    })

    if (this.style.doubleHeight) {
      const ghostLine = {}

      Object.keys(matrix[0]).forEach((key) => {
        const ghostCell = new Cell()
        ghostCell.isGhost = true

        ghostLine[key] = ghostCell
      })

      matrix[-1] = ghostLine
    }

    return matrix
  }
}