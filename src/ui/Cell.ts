import CellStyle from "./CellStyle.ts"
import CharacterMode from "./CharacterMode.ts";

export default class Cell {
  public isGhost: boolean = false
  public char: string = ' '
  public style: CellStyle = new CellStyle()

  equals(other: Cell): boolean {
    return this.char === other.char
      && this.isGhost === other.isGhost
      && this.style.equals(other.style)
  }
}