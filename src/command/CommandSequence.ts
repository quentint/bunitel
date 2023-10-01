import Command from './Command.ts'

export default class CommandSequence {

  private _buffer: Array<Command> = []

  addToBuffer(command: Command) {
    this._buffer.push(command)
  }

  public bufferToString(): string {
    return this._buffer.map((command: Command) => {
      return command.toNumberArray().map((n: number) => {
        return String.fromCharCode(n)
      }).join('')
    }).join('')
  }

  public toReadableString(): string {
    return this._buffer.map((command: Command) => {
      return command.toReadableString()
    }).join('\n')
  }

}