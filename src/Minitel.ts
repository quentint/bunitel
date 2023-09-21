import {ServerWebSocket} from 'bun'
import {COF, CON, ESC, FF, RS, US} from '../constants.ts'
import WebSocketData from './WebSocketData.ts'
import CellMode from './grid/cell/CellMode.ts'
import CellColor from './grid/cell/CellColor.ts'

export default class Minitel {

  private bufferSequence: Array<number | string> = []

  constructor(private ws: ServerWebSocket<WebSocketData>) {
  }

  sendBuffer() {
    let data = this.bufferSequence.map((c) => {
      return typeof c === 'number' ? String.fromCharCode(c) : c
    }).join('')

    this.ws.send(data)
    this.bufferSequence = []

    return data
  }

  moveToOrigin() {
    this.addToBuffer([RS])
  }

  moveTo(x, y) {
    if (x === 0 && y === 0) {
      this.moveToOrigin()
      return
    }
    this.addToBuffer([US, 0x40 + y + 1, 0x40 + x + 1])
  }

  addCharacterToBuffer(char: string) {
    this.addToBuffer(char)
  }

  addToBuffer(item: number | string | Array<number | string>) {
    if (Array.isArray(item)) {
      this.bufferSequence.push(...item)
    } else {
      this.bufferSequence.push(item)
    }
  }

  showCursor(b: boolean) {
    this.addToBuffer([b ? CON : COF])
  }

  setCharacterMode(mode: CellMode) {
    this.addToBuffer(mode)
  }

  styleForeground(color: CellColor) {
    this.addToBuffer([ESC, 0x40 + color])
  }

  styleBackground(color: CellColor) {
    this.addToBuffer([ESC, 0x50 + color])
  }

  styleUnderline(isUnderlined: boolean) {
    this.addToBuffer([ESC, isUnderlined ? 0x5a : 0x59])
  }

  styleBlink(isBlinking: boolean) {
    this.addToBuffer([ESC, isBlinking ? 0x48 : 0x49])
  }

  styleInvert(isInverted: boolean) {
    this.addToBuffer([ESC, isInverted ? 0x5d : 0x5c])
  }

  clear() {
    this.addToBuffer([FF])
  }

  setCharacterSize(doubleWidth: boolean, doubleHeight: boolean) {
    this.addToBuffer([ESC, 0x4c + (doubleHeight ? 1 : 0) + (doubleWidth ? 2 : 0)])
  }
}