import {AbstractCell} from './AbstractCell.ts'
import {CellData} from './CellData.ts'

export class GhostCell extends AbstractCell {

  toCellData(): CellData {
    const cellData = super.toCellData()
    cellData.ghost = true

    return cellData
  }
}