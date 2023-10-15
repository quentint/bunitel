import {CellData} from './CellData.ts'

export abstract class AbstractCell {

  public toCellData(): CellData {
    return new CellData()
  }

}