import Minitel from './Minitel.ts'
import {ServerWebSocket, sleep} from 'bun'
import WebSocketData from './WebSocketData.ts'
import MinitelStage from './ui/MinitelStage.ts'
import Label from './ui/compo/Label.ts'
import DisplayObject from './ui/DisplayObject.ts'
import CellColor from './grid/cell/CellColor.ts'
import MosaicLabel from './ui/compo/MosaicLabel.ts'
import MinitelSequence from './MinitelSequence.ts'

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
  private stage: MinitelStage

  constructor(private ws: ServerWebSocket<WebSocketData>) {
    this.minitel = new Minitel(ws)
    this.stage = new MinitelStage()

    this.stage.emitter.on('update', (sequence: MinitelSequence) => {
      this.minitel.sendSequence(sequence)
    })
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

    const dashes = new MosaicLabel('!!!!!!!!')
    dashes.foregroundColor = CellColor.RED_50
    dashes.backgroundColor = CellColor.YELLOW_90
    dashes.y = 5

    const container1 = new DisplayObject()
    // container1.x = -5

    this.stage.addChild(container1)

    container1.addChild(hello)
    container1.addChild(world)
    container1.addChild(again)

    this.stage.addChild(dashes)

    this.stage.update()

    for (let i = 0; i < 2; i++) {
      await sleep(2000)
      container1.x++
      container1.y++
      dashes.y++
      this.stage.update()
    }
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