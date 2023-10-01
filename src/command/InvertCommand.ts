import Command from './Command.ts'

export default class InvertCommand implements Command {

  constructor(public active: boolean) {
  }

  toNumberArray(): Array<number> {
    return [27, this.active ? 93 : 92]
  }
}