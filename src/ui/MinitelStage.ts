import DisplayObject from './DisplayObject.ts'
import AbstractCellGrid from '../grid/AbstractCellGrid.ts'
import AbstractCell from '../grid/cell/AbstractCell.ts'
import CommandSequence from '../command/CommandSequence.ts'
import {debounce} from 'perfect-debounce'
import StageEvent from '../event/StageEvent.ts'
import MoveToAbsoluteCommand from '../command/MoveToAbsoluteCommand.ts'
import SetCharacterModeCommand from '../command/SetCharacterModeCommand.ts'
import SetCharacterSizeCommand from '../command/SetCharacterSizeCommand.ts'
import UnderlineCommand from '../command/UnderlineCommand.ts'
import BlinkCommand from '../command/BlinkCommand.ts'
import InvertCommand from '../command/InvertCommand.ts'
import SetForegroundColorCommand from '../command/SetForegroundColorCommand.ts'
import SetBackgroundColorCommand from '../command/SetBackgroundColorCommand.ts'
import AddStringCommand from '../command/AddStringCommand.ts'

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
    this.emitter.emit(StageEvent.UPDATE, sequence)
    this._previousGrid = grid
  }

  // TODO: Extract
  private buildSequenceFromDiff(diff: AbstractCellGrid) {
    let previousCell: AbstractCell | null = null
    let previousCellLineIndex: number | null = null
    let previousCellCharIndex: number | null = null

    const sequence = new CommandSequence()

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
          sequence.addToBuffer(new MoveToAbsoluteCommand(charNumber, lineNumber))
        }

        if (forcePushChanges || previousCellData && cellData.cellMode !== previousCellData.cellMode) {
          sequence.addToBuffer(new SetCharacterModeCommand(cellData.cellMode))
        }

        const setDoubleWidth = (forcePushChanges || previousCellData && cellData.doubleWidth !== previousCellData.doubleWidth) && cellData.doubleWidth !== null
        const setDoubleHeight = (forcePushChanges || previousCellData && cellData.doubleHeight !== previousCellData.doubleHeight) && cellData.doubleHeight !== null
        if (setDoubleWidth || setDoubleHeight) {
          sequence.addToBuffer(new SetCharacterSizeCommand(cellData.doubleWidth === true, cellData.doubleHeight === true))
        }

        if ((forcePushChanges || previousCellData && cellData.underlineOrSeparated !== previousCellData.underlineOrSeparated) && cellData.underlineOrSeparated !== null) {
          sequence.addToBuffer(new UnderlineCommand(cellData.underlineOrSeparated))
        }

        if ((forcePushChanges || previousCellData && cellData.blink !== previousCellData.blink) && cellData.blink !== null) {
          sequence.addToBuffer(new BlinkCommand(cellData.blink))
        }

        if ((forcePushChanges || previousCellData && cellData.invert !== previousCellData.invert) && cellData.invert !== null) {
          sequence.addToBuffer(new InvertCommand(cellData.invert))
        }

        if ((forcePushChanges || previousCellData && cellData.foregroundColor !== previousCellData.foregroundColor) && cellData.foregroundColor !== null) {
          sequence.addToBuffer(new SetForegroundColorCommand(cellData.foregroundColor))
        }

        if ((forcePushChanges || previousCellData && cellData.backgroundColor !== previousCellData.backgroundColor) && cellData.backgroundColor !== null) {
          sequence.addToBuffer(new SetBackgroundColorCommand(cellData.backgroundColor))
        }

        sequence.addToBuffer(new AddStringCommand(cellData.char))

        previousCell = cell
        previousCellLineIndex = lineNumber
        previousCellCharIndex = charNumber
      }
    }

    return sequence
  }
}