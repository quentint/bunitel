import MinitelApp from './src/MinitelApp.ts'
import Label from './src/ui/compo/Label.ts'
import CellColor from './src/grid/cell/CellColor.ts'
import MosaicLabel from './src/ui/compo/MosaicLabel.ts'
import DisplayObject from './src/ui/DisplayObject.ts'
import MosaicCharacterUtils from './src/grid/cell/utils/MosaicCharacterUtils.ts'
import QrCode from './src/ui/compo/QrCode.ts'
import TextInput from './src/ui/compo/TextInput.ts'
import CommandSequenceFactory from './src/command/CommandSequenceFactory.ts'

export default class MyTestApp extends MinitelApp {

  container: DisplayObject
  qr: QrCode

  public async onOpen() {


    const seq = CommandSequenceFactory.fromString('AALYI\\G..........CALYI\\G..........IALYI\\G..........KALYI\\DHello!LALYI]GWorldMALYI]A113efb49-60a1-4365-b00d-3979898b7507CA')
    console.log(seq.toReadableString())

    return

    const hello = new Label('Hello!')
    // hello.doubleWidth = true
    // hello.doubleHeight = true
    // hello.y = 1
    hello.color = CellColor.BLUE_40
    // hello.invert = true
    // hello.blink = true

    const world = new Label('World')
    world.invert = true
    world.y = 1

    const again = new Label(this.clientId)
    again.color = CellColor.RED_50
    again.invert = true
    again.y = 2

    const dashes = new MosaicLabel(MosaicCharacterUtils.fromBitString('110011'))
    dashes.foregroundColor = CellColor.RED_50
    dashes.backgroundColor = CellColor.YELLOW_90
    dashes.y = 5

    this.container = new DisplayObject()
    this.container.y = 10

    this.container.addChild(hello)
    this.container.addChild(world)
    this.container.addChild(again)
    const containerTextInput = new TextInput()
    containerTextInput.y = -2
    this.container.addChild(containerTextInput)

    // this.stage.addChild(dashes)

    this.qr = new QrCode('https://quentin.codes')
    this.qr.foregroundColor = CellColor.BLACK_0
    this.qr.backgroundColor = CellColor.WHITE_100
    // qr.x = 10
    // qr.y = 10
    // this.stage.addChild(this.qr)
    this.stage.addChild(this.container)

    const textInput1 = new TextInput()
    this.stage.addChild(textInput1)

    const textInput2 = new TextInput()
    textInput2.y = 2
    this.stage.addChild(textInput2)

    this.focusManager.focus(textInput2)

    // for (let i = 0; i < 2; i++) {
    //   await sleep(2000)
    //   this.container.x += 5
    //   this.container.y++
    //   dashes.y++
    //   this.stage.requestUpdate()
    // }
  }

  // async onMessage(message): Promise<void> {
  //   console.log(message.charCodeAt(0))
  // }

  onUp() {
    // this.container.y--
    this.qr.y--
    this.stage.requestUpdate()
  }

  onDown() {
    // this.container.y++
    this.qr.y++
    this.stage.requestUpdate()
  }

  onLeft() {
    // this.container.x--
    this.qr.x--
    this.stage.requestUpdate()
  }

  onRight() {
    // this.container.x++
    this.qr.x++
    this.stage.requestUpdate()
  }
}