import {Command} from './Command.ts'
import {ClearMode} from './ClearMode.ts'

export class ClearCommand implements Command {

  constructor(public mode: ClearMode) {
  }

  static modeToCharCodes(mode: ClearMode): Array<number> {
    switch (mode) {
      case ClearMode.SCREEN:
        return [12]
      case ClearMode.FROM_CURSOR_TO_EOL:
        return [24]
      case ClearMode.ALL_AFTER_CURSOR:
        return [27, 91, 74]
      case ClearMode.ALL_BEFORE_CURSOR:
        return [27, 91, 49, 74]
      case ClearMode.FROM_LINE_START_TO_CURSOR:
        return [27, 91, 49, 75]
      case ClearMode.LINE:
        return [27, 91, 50, 75]
      case ClearMode.STATUS_LINE:
        return [31, 64, 65, 24, 10]
      case ClearMode.SCREEN_AND_STATUS_LINE:
        return [12, 31, 64, 65, 24, 10]
      default:
        throw new Error(`Unknown clear mode: ${mode}`)
    }
  }

  static consume(charCodes: Array<number>): ClearCommand | null {
    for (let modeKey in ClearMode) {
      const modeCharCodes = ClearCommand.modeToCharCodes(modeKey as ClearMode)

      for (let i = 0; i < modeCharCodes.length; i++) {
        if (modeCharCodes[i] !== charCodes[i]) {
          break
        }

        if (i === modeCharCodes.length - 1) {
          return new ClearCommand(modeKey as ClearMode)
        }
      }
    }

    return null
  }

  toNumberArray(): Array<number> {
    return ClearCommand.modeToCharCodes(this.mode)
  }

  toReadableString(): string {
    return `clear ${ClearMode[this.mode]}`
  }

}