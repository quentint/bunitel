import Minitel from './Minitel.ts'
import {ServerWebSocket, sleep} from 'bun'
import WebSocketData from './WebSocketData.ts'
import MinitelStage from './ui/MinitelStage.ts'
import Label from './ui/compo/Label.ts'
import DisplayObject from './ui/DisplayObject.ts'
import AbstractCellGrid from './grid/AbstractCellGrid.ts'
import AbstractCell from './grid/cell/AbstractCell.ts'
import CellColor from './grid/cell/CellColor.ts'
import MosaicLabel from './ui/compo/MosaicLabel.ts'

const specialKeys = {
  sommaire: 'F',
  annulation: 'E',
  retour: 'B',
  repetition: 'C',
  guide: 'D',
  correction: 'G',
  suite: 'H',
  envoi: 'A',
}

export default class ServerWebSocketMinitelBridge {
  private minitel: Minitel
  private previousGrid: AbstractCellGrid
  private stage: MinitelStage

  constructor(private ws: ServerWebSocket<WebSocketData>) {
    this.minitel = new Minitel(ws)
    this.stage = new MinitelStage()
    this.previousGrid = new AbstractCellGrid()
  }

  async onOpen() {
    const hello = new Label('Hello!')
    // hello.doubleWidth = true
    // hello.doubleHeight = true
    hello.y = 1
    hello.color = CellColor.BLUE_40
    // hello.invert = true
    // hello.blink = true

    const world = new Label('World')
    world.invert = true
    world.y = 2

    const again = new Label('Again')
    again.color = CellColor.RED_50
    again.invert = true
    again.y = 3

    const dashes = new MosaicLabel('ssssssssssss')
    dashes.y = 5

    const container1 = new DisplayObject()
    // container1.x = -5

    this.stage.addChild(container1)

    container1.addChild(hello)
    container1.addChild(world)
    container1.addChild(again)

    this.stage.addChild(dashes)

    this.refreshStage()

    for (let i = 0; i < 2; i++) {
      await sleep(2000)
      container1.x++
      container1.y++
      dashes.y++
      this.refreshStage()
    }
  }

  refreshStage() {
    let grid = this.stage.getGrid()

    const diff = grid.diff(this.previousGrid, MinitelStage.WIDTH, MinitelStage.HEIGHT)

    let previousCell: AbstractCell | null = null
    let previousCellLineIndex: number | null = null
    let previousCellCharIndex: number | null = null

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
          this.minitel.moveTo(charNumber, lineNumber)
        }

        if (forcePushChanges || previousCellData && cellData.cellMode !== previousCellData.cellMode) {
          this.minitel.setCharacterMode(cellData.cellMode)
        }

        const setDoubleWidth = (forcePushChanges || previousCellData && cellData.doubleWidth !== previousCellData.doubleWidth) && cellData.doubleWidth !== null
        const setDoubleHeight = (forcePushChanges || previousCellData && cellData.doubleHeight !== previousCellData.doubleHeight) && cellData.doubleHeight !== null
        if (setDoubleWidth || setDoubleHeight) {
          this.minitel.setCharacterSize(cellData.doubleWidth === true, cellData.doubleHeight === true)
        }

        if ((forcePushChanges || previousCellData && cellData.underlineOrSeparated !== previousCellData.underlineOrSeparated) && cellData.underlineOrSeparated !== null) {
          this.minitel.styleUnderline(cellData.underlineOrSeparated)
        }

        if ((forcePushChanges || previousCellData && cellData.blink !== previousCellData.blink) && cellData.blink !== null) {
          this.minitel.styleBlink(cellData.blink)
        }

        if ((forcePushChanges || previousCellData && cellData.invert !== previousCellData.invert) && cellData.invert !== null) {
          this.minitel.styleInvert(cellData.invert)
        }

        if ((forcePushChanges || previousCellData && cellData.foregroundColor !== previousCellData.foregroundColor) && cellData.foregroundColor !== null) {
          this.minitel.styleForeground(cellData.foregroundColor)
        }

        // if (forcePushChanges || previousCellData && cellData.foregroundColor !== previousCellData.foregroundColor && cellData.foregroundColor !== null) {
        //   this.minitel.styleForeground(cellData.foregroundColor)
        // }

        // if (forcePushChanges || previousCellData && !cellData.colorsEqual(previousCell.style)) {
        //   this.minitel.styleColors(cellData.foregroundColor, cellData.backgroundColor)
        // }

        this.minitel.addCharacterToBuffer(cellData.char)

        previousCell = cell
        previousCellLineIndex = lineNumber
        previousCellCharIndex = charNumber
      }
    }

    this.previousGrid = grid
    this.minitel.sendBuffer()
  }

  onMessage(message) {
    console.log(`${this.ws.data.id} Received ${message}`)

    if (message === specialKeys.sommaire) {
      this.onTOC()
      return
    }

    if (message === specialKeys.annulation) {
      this.onCancel()
      return
    }

    // if (message === 'A' || message === 'Z') {
    //   this.minitel.moveTo(10, 10);
    //   for (let i = 0; i < 10; i++) {
    //     this.ws.send(message)
    //   }
    //   return
    // }
    //
    // if (message === 'E') {
    //   this.minitel.sendSequence(['hello'])
    //   return
    // }
    //
    // if (message === 'C') {
    //   this.minitel.toggleCursor()
    //   return
    // }
    //
    // if (message === 'B') {
    //   this.minitel.clear()
    //   return
    // }
  }

  onTOC() {
    console.log(`${this.ws.data.id} !!! TOC`)
  }

  onCancel() {
    console.log(`${this.ws.data.id} !!! CANCEL`)
  }
}