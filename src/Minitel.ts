import {ServerWebSocket} from 'bun'
import WebSocketData from './WebSocketData.ts'
import MinitelSequence from './MinitelSequence.ts'

export default class Minitel {

  constructor(private ws: ServerWebSocket<WebSocketData>) {
  }

  public sendSequence(sequence: MinitelSequence) {
    let data = sequence.buffer.map((c) => {
      return typeof c === 'number' ? String.fromCharCode(c) : c
    }).join('')

    this.ws.send(data)

    return data
  }
}