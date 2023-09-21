import Color from "./Color.ts"
import CharacterMode from "./CharacterMode.ts"

export default class CellStyle {
  public characterMode: CharacterMode = CharacterMode.STANDARD

  public foregroundColor: Color = Color.WHITE
  public backgroundColor: Color = Color.BLACK

  public doubleWidth: boolean = false
  public doubleHeight: boolean = false

  public blink: boolean = false
  public invert: boolean = false
  public underline: boolean = false

  equals(other: CellStyle): boolean {
    return this.characterMode === other.characterMode
      && this.sizeEquals(other)
      && this.colorsEqual(other)
      && this.effectsEqual(other)
  }

  sizeEquals(other: CellStyle): boolean {
    return this.doubleWidth === other.doubleWidth
      && this.doubleHeight === other.doubleHeight
  }

  colorsEqual(other: CellStyle): boolean {
    return this.foregroundColor === other.foregroundColor
      && this.backgroundColor === other.backgroundColor
  }

  effectsEqual(other: CellStyle): boolean {
    return this.blink === other.blink
      && this.invert === other.invert
      && this.underline === other.underline
  }
}