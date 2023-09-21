import AbstractCharCell from './AbstractCharCell.ts'
import CellColor from './CellColor.ts'
import CellData from './CellData.ts'

export default class CharacterCell extends AbstractCharCell {

  public invert: boolean = false
  public underline: boolean = false
  public doubleWidth: boolean = false
  public doubleHeight: boolean = false
  public color: CellColor = CellColor.DEFAULT_FOREGROUND

  toCellData(): CellData {
    const cellData = super.toCellData()

    cellData.invert = this.invert
    cellData.underlineOrSeparated = this.underline
    cellData.doubleWidth = this.doubleWidth
    cellData.doubleHeight = this.doubleHeight
    cellData.foregroundColor = this.color

    return cellData
  }
}