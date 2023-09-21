import AbstractCell from './AbstractCell.ts'
import CellData from './CellData.ts'

export default class GhostCell extends AbstractCell {

  toCellData(): CellData {
    const cellData = super.toCellData()
    cellData.ghost = true

    return cellData
  }
}