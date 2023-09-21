import DisplayObject from './DisplayObject.ts'
import AbstractCellGrid from '../grid/AbstractCellGrid.ts'
import AbstractCell from '../grid/cell/AbstractCell.ts'
import MinitelSequence from '../MinitelSequence.ts'

export default class MinitelStage extends DisplayObject {
  static WIDTH: number = 40
  static HEIGHT: number = 25

  private previousGrid: AbstractCellGrid = new AbstractCellGrid()

  public update() {
    let grid = this.getGrid()
    const diff = grid.diff(this.previousGrid, MinitelStage.WIDTH - 1, MinitelStage.HEIGHT - 2)

    const sequence = this.buildSequenceFromDiff(diff)
    this.emitter.emit('update', sequence)
    this.previousGrid = grid
  }

  // TODO: Extract
  private buildSequenceFromDiff(diff: AbstractCellGrid) {
    let previousCell: AbstractCell | null = null
    let previousCellLineIndex: number | null = null
    let previousCellCharIndex: number | null = null

    const sequence = new MinitelSequence()

    for (let lineIndex: number = diff.minY; lineIndex <= diff.maxY; lineIndex++) {
      for (let charIndex: number = diff.minX; charIndex <= diff.maxX; charIndex++) {
        const cell = diff.get(charIndex, lineIndex)

        if (!cell) {
          continue
        }

        const cellData = cell.toCellData()
        const previousCellData = previousCell && previousCell.toCellData()

        const lineNumber = Number(lineIndex)
        const charNumber = Number(charIndex)

        if (cellData.ghost) {
          previousCell = cell
          previousCellLineIndex = lineNumber
          previousCellCharIndex = charNumber

          continue
        }

        let forcePushChanges = !previousCell || previousCellLineIndex !== lineNumber || previousCellCharIndex !== charNumber - 1

        if (forcePushChanges) {
          sequence.moveTo(charNumber, lineNumber)
        }

        if (forcePushChanges || previousCellData && cellData.cellMode !== previousCellData.cellMode) {
          sequence.setCharacterMode(cellData.cellMode)
        }

        const setDoubleWidth = (forcePushChanges || previousCellData && cellData.doubleWidth !== previousCellData.doubleWidth) && cellData.doubleWidth !== null
        const setDoubleHeight = (forcePushChanges || previousCellData && cellData.doubleHeight !== previousCellData.doubleHeight) && cellData.doubleHeight !== null
        if (setDoubleWidth || setDoubleHeight) {
          sequence.setCharacterSize(cellData.doubleWidth === true, cellData.doubleHeight === true)
        }

        if ((forcePushChanges || previousCellData && cellData.underlineOrSeparated !== previousCellData.underlineOrSeparated) && cellData.underlineOrSeparated !== null) {
          sequence.styleUnderline(cellData.underlineOrSeparated)
        }

        if ((forcePushChanges || previousCellData && cellData.blink !== previousCellData.blink) && cellData.blink !== null) {
          sequence.styleBlink(cellData.blink)
        }

        if ((forcePushChanges || previousCellData && cellData.invert !== previousCellData.invert) && cellData.invert !== null) {
          sequence.styleInvert(cellData.invert)
        }

        if ((forcePushChanges || previousCellData && cellData.foregroundColor !== previousCellData.foregroundColor) && cellData.foregroundColor !== null) {
          sequence.styleForeground(cellData.foregroundColor)
        }

        if ((forcePushChanges || previousCellData && cellData.backgroundColor !== previousCellData.backgroundColor) && cellData.backgroundColor !== null) {
          sequence.styleBackground(cellData.backgroundColor)
        }

        sequence.addCharacterToBuffer(cellData.char)

        previousCell = cell
        previousCellLineIndex = lineNumber
        previousCellCharIndex = charNumber
      }
    }

    return sequence
  }
}