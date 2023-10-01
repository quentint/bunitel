import Command from './Command.ts'

export default class MoveToOriginCommand implements Command {

  toNumberArray(): Array<number> {
    return [30]
  }

}