import AbstractCell from './AbstractCell.ts'
import CellData from './CellData.ts'

export default abstract class AbstractCharCell extends AbstractCell {

  public blink: boolean = false

  constructor(public char: string = '') {
    super()
  }

  toCellData(): CellData {
    const cellData = super.toCellData()
    cellData.char = this.char
    cellData.blink = this.blink

    return cellData
  }
}