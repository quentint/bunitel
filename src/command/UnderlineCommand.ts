import Command from './Command.ts'

export default class UnderlineCommand implements Command {

  constructor(public active: boolean) {
  }

  toNumberArray(): Array<number> {
    return [27, this.active ? 90 : 89]
  }
}