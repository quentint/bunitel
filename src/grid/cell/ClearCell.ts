import {CharacterCell} from './CharacterCell.ts'
import {CellData} from './CellData.ts'
import {CellColor} from './CellColor.ts'

export class ClearCell extends CharacterCell {
  constructor() {
    super(' ')
  }


  toCellData(): CellData {
    const cellData = super.toCellData()

    cellData.backgroundColor = CellColor.DEFAULT_BACKGROUND
    cellData.foregroundColor = CellColor.DEFAULT_FOREGROUND

    return cellData
  }
}