import CellData from './CellData.ts'

export default abstract class AbstractCell {

  public toCellData(): CellData {
    return new CellData()
  }

}