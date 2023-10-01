import Command from './Command.ts'

export default class BlinkCommand implements Command {

  constructor(public active: boolean) {
  }

  toNumberArray(): Array<number> {
    return [27, this.active ? 72 : 73]
  }
}