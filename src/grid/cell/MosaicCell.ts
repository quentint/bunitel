import AbstractCharCell from './AbstractCharCell.ts'
import CellColor from './CellColor.ts'
import CellData from './CellData.ts'
import CellMode from './CellMode.ts'

export default class MosaicCell extends AbstractCharCell {

  public separated: boolean = false
  public foregroundColor: CellColor = CellColor.DEFAULT_FOREGROUND
  public backgroundColor: CellColor = CellColor.DEFAULT_BACKGROUND

  toCellData(): CellData {
    const cellData = super.toCellData()

    cellData.cellMode = CellMode.MOSAIC
    cellData.underlineOrSeparated = this.separated
    cellData.foregroundColor = this.foregroundColor
    cellData.backgroundColor = this.backgroundColor

    return cellData
  }

}