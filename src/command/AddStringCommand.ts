import Command from './Command.ts'

export default class AddStringCommand implements Command {

  constructor(public s: string) {
  }

  toNumberArray(): Array<number> {
    return this.s.split('').map(c => c.charCodeAt(0))
  }

}