import {CellColor} from './CellColor.ts'
import {CellMode} from './CellMode.ts'

export class CellData {
  public ghost: boolean = false
  public cellMode: CellMode = CellMode.STANDARD
  public char: string = ' '
  public blink: boolean|null = null
  public invert: boolean|null = null
  public underlineOrSeparated: boolean|null = null
  public doubleWidth: boolean|null = null
  public doubleHeight: boolean|null = null
  public foregroundColor: CellColor|null = null
  public backgroundColor: CellColor|null = null

  public equals(other: CellData): boolean {
    return this.ghost === other.ghost
      && this.cellMode === other.cellMode
      && this.char === other.char
      && this.blink === other.blink
      && this.invert === other.invert
      && this.underlineOrSeparated === other.underlineOrSeparated
      && this.doubleWidth === other.doubleWidth
      && this.doubleHeight === other.doubleHeight
      && this.foregroundColor === other.foregroundColor
      && this.backgroundColor === other.backgroundColor
  }
}