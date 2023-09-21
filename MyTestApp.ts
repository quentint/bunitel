import MinitelApp from './src/MinitelApp.ts'
import Label from './src/ui/compo/Label.ts'
import CellColor from './src/grid/cell/CellColor.ts'
import MosaicLabel from './src/ui/compo/MosaicLabel.ts'
import DisplayObject from './src/ui/DisplayObject.ts'
import {sleep} from 'bun'

export default class MyTestApp extends MinitelApp {
  public async onOpen() {
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

    const again = new Label(this.clientId)
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
      container1.x += 5
      container1.y++
      dashes.y++
      this.stage.update()
    }
  }
}