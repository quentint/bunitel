import AbstractCharCell from './AbstractCharCell.ts'
import CellColor from './CellColor.ts'
import CellData from './CellData.ts'
import CellMode from './CellMode.ts'

export default class MosaicCell extends AbstractCharCell {

  public separated: boolean = false
  public foregroundColor: CellColor = CellColor.WHITE_100
  public backgroundColor: CellColor = CellColor.BLACK_0

  toCellData(): CellData {
    const cellData = super.toCellData()

    cellData.cellMode = CellMode.MOSAIC
    cellData.underlineOrSeparated = this.separated
    cellData.foregroundColor = this.foregroundColor
    cellData.backgroundColor = this.backgroundColor

    return cellData
  }

}