import DisplayObject from './DisplayObject.ts'
import AbstractCellGrid from '../grid/AbstractCellGrid.ts'
import AbstractCell from '../grid/cell/AbstractCell.ts'
import MinitelSequence from '../MinitelSequence.ts'
import {debounce} from 'perfect-debounce'

export default class MinitelStage extends DisplayObject {
  static WIDTH: number = 40
  static HEIGHT: number = 25

  private _previousGrid: AbstractCellGrid = new AbstractCellGrid()

  public requestUpdate: Function

  constructor() {
    super()
    this.requestUpdate = debounce(() => {
      this._update()
    }, 100)
  }

  private _update() {
    let grid = this.getGrid()
    const diff = grid.diff(this._previousGrid, MinitelStage.WIDTH - 1, MinitelStage.HEIGHT - 2)

    const sequence = this.buildSequenceFromDiff(diff)
    this.emitter.emit('update', sequence)
    this._previousGrid = grid
  }

  // TODO: Extract
  private buildSequenceFromDiff(diff: AbstractCellGrid) {
    let previousCell: AbstractCell | null = null
    let previousCellLineIndex: number | null = null
    let previousCellCharIndex: number | null = null

    const sequence = new MinitelSequence()

    for (let lineIndex: number = diff.innerMinY; lineIndex <= diff.innerMaxY; lineIndex++) {
      for (let charIndex: number = diff.innerMinX; charIndex <= diff.innerMaxX; charIndex++) {
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