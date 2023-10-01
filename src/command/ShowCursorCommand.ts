import Command from './Command.ts'

export default class ShowCursorCommand implements Command {

  constructor(public show: boolean) {
  }

  toNumberArray(): Array<number> {
    return [this.show ? 17 : 20]
  }
}