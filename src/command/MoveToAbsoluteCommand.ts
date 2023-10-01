import Command from './Command.ts'

export default class MoveToAbsoluteCommand implements Command {

  constructor(public x: number, public y: number) {
  }

  toNumberArray(): Array<number> {
    return [31, 64 + this.y + 1, 64 + this.x + 1]
  }
}