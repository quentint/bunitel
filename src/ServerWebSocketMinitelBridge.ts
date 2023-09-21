import Minitel from "./Minitel.ts"
import {ServerWebSocket, sleep} from "bun"
import WebSocketData from "./WebSocketData.ts"
import MinitelStage from "./ui/MinitelStage.ts"
import Label from "./ui/compo/Label.ts"
import DisplayObject from "./ui/DisplayObject.ts"
import DisplayMatrix from "./types/DisplayMatrix.ts"
import Cell from "./ui/Cell.ts"
import Color from "./ui/Color.ts"
import CharacterMode from "./ui/CharacterMode.ts"

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
  private previousMatrix: DisplayMatrix
  private stage: MinitelStage

  constructor(private ws: ServerWebSocket<WebSocketData>) {
    this.minitel = new Minitel(ws)
    this.stage = new MinitelStage()
    this.previousMatrix = this.stage.getStageEmptyMatrix()
  }

  async onOpen() {
    const hello = new Label('Hello!')
    // hello.style.doubleWidth = true
    // hello.style.doubleHeight = true
    hello.y = 1
    hello.style.foregroundColor = Color.BLUE
    hello.style.invert = true
    hello.style.blink = true

    const world = new Label('World')
    world.style.invert = true
    world.y = 2

    const again = new Label('Again')
    again.style.foregroundColor = Color.RED
    again.style.invert = true
    again.y = 3

    const dashes = new Label('ssssssssssss')
    dashes.style.characterMode = CharacterMode.MOSAIC
    dashes.y = 5

    const container1 = new DisplayObject()
    container1.x = -5

    this.stage.addChild(container1)

    container1.addChild(hello)
    container1.addChild(world)
    container1.addChild(again)

    this.stage.addChild(dashes)

    this.refreshStage()

    for (let i = 0; i < 10; i++) {
      await sleep(2000)
      container1.x++
      container1.y++
      dashes.y++
      this.refreshStage()
    }
  }

  refreshStage() {
    let matrix = this.stage.getMatrix()

    // const ghosts = this.findGhosts(this.previousMatrix)
    //
    // console.log(ghosts)

    // this.minitel.moveToOrigin()
    // for (let lineIndex in ghosts) {
    //   for (let charIndex in ghosts[lineIndex]) {
    //     const cell = ghosts[lineIndex][charIndex]
    //     if (cell) {
    //       console.log(cell)
    //       this.minitel.moveTo(charIndex, lineIndex)
    //       this.minitel.addToBuffer('a')
    //     }
    //   }
    // }

    const diff = this.computeMatrixDiff(this.previousMatrix, matrix)

    let previousCell: Cell | null = null
    let previousCellLineIndex: number | null = null
    let previousCellCharIndex: number | null = null

    for (let lineIndex in diff) {

      for (let charIndex in diff[lineIndex]) {
        const cell = diff[lineIndex][charIndex]

        const lineNumber = Number(lineIndex)
        const charNumber = Number(charIndex)

        if (!cell) {
          continue
        }

        if (cell.isGhost) {
          previousCell = cell
          previousCellLineIndex = lineNumber
          previousCellCharIndex = charNumber

          continue
        }

        let forcePushChanges = !previousCell || previousCellLineIndex !== lineNumber || previousCellCharIndex !== charNumber - 1;

        if (forcePushChanges) {
          this.minitel.moveTo(charNumber, lineNumber)
        }

        if (forcePushChanges || previousCell && cell.style.characterMode !== previousCell.style.characterMode) {
          this.minitel.setCharacterMode(cell.style.characterMode)
        }

        if (forcePushChanges || previousCell && !cell.style.sizeEquals(previousCell.style)) {
          this.minitel.setCharacterSize(cell.style.doubleWidth, cell.style.doubleHeight)
        }

        if (forcePushChanges || previousCell && !cell.style.effectsEqual(previousCell.style)) {
          this.minitel.styleEffects(cell.style.underline, cell.style.blink, cell.style.invert)
        }

        if (forcePushChanges || previousCell && !cell.style.colorsEqual(previousCell.style)) {
          this.minitel.styleColors(cell.style.foregroundColor, cell.style.backgroundColor)
        }

        this.minitel.addToBuffer(cell.char)

        previousCell = cell
        previousCellLineIndex = lineNumber
        previousCellCharIndex = charNumber
      }
    }

    this.previousMatrix = matrix
    this.minitel.sendBuffer()
  }

  // findGhosts(matrix: DisplayMatrix): DisplayMatrix {
  //   const ghosts: DisplayMatrix = {}
  //
  //   for (let lineIndex in matrix) {
  //     ghosts[lineIndex] = {}
  //     for (let charIndex in matrix[lineIndex]) {
  //       const cell = matrix[lineIndex][charIndex]
  //       if (cell.isGhost) {
  //         ghosts[lineIndex][charIndex] = cell
  //       }
  //     }
  //   }
  //
  //   return ghosts
  // }

  computeMatrixDiff(before: DisplayMatrix, after: DisplayMatrix): DisplayMatrix {
    let diff: DisplayMatrix = {}

    for (let y in after) {
      diff[y] = {}
      for (let x in after[y]) {
        const beforeCell = before[y][x]
        const afterCell = after[y][x]
        if (!beforeCell || !beforeCell.equals(afterCell)) {
          diff[y][x] = afterCell
        }
      }
    }

    return diff
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