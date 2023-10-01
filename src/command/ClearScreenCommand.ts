import Command from './Command.ts'

export default class ClearScreenCommand implements Command {

  toNumberArray(): Array<number> {
    return [12]
  }

}