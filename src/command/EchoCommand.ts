import Command from './Command.ts'

export default class EchoCommand implements Command {

  constructor(public active: boolean) {
  }

  static consume(charCodes: Array<number>): EchoCommand | null {
    if (charCodes[0] === 27 && charCodes[1] === 59 && (charCodes[2] === 97 || charCodes[2] === 96) && charCodes[3] === 88 && charCodes[4] === 82) {
      return new EchoCommand(charCodes[2] === 97)
    }

    return null
  }

  toNumberArray(): Array<number> {
    return this.active ?
        [27, 59, 97, 88, 82] :
        [27, 59, 96, 88, 82]
  }

  toReadableString(): string {
    return `echo ${this.active ? 'on' : 'off'}`
  }
}