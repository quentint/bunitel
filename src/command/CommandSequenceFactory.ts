import {CommandSequence} from './CommandSequence.ts'
import {BlinkCommand} from './BlinkCommand.ts'
import {ClearCommand} from './ClearCommand.ts'
import {MoveToOriginCommand} from './MoveToOriginCommand.ts'
import {SetCharacterModeCommand} from './SetCharacterModeCommand.ts'
import {InvertCommand} from './InvertCommand.ts'
import {MoveToAbsoluteCommand} from './MoveToAbsoluteCommand.ts'
import {SetBackgroundColorCommand} from './SetBackgroundColorCommand.ts'
import {SetCharacterSizeCommand} from './SetCharacterSizeCommand.ts'
import {SetForegroundColorCommand} from './SetForegroundColorCommand.ts'
import {ShowCursorCommand} from './ShowCursorCommand.ts'
import {UnderlineCommand} from './UnderlineCommand.ts'
import {BeepCommand} from './BeepCommand.ts'
import {EchoCommand} from './EchoCommand.ts'
import {MoveToLineStartCommand} from './MoveToLineStartCommand.ts'
import {MoveToRelativeCommand} from './MoveToRelativeCommand.ts'
import {RepeatCharacterCommand} from './RepeatCharacterCommand.ts'
import {AddStringCommand} from './AddStringCommand.ts'

// TODO: Arrows, accented characters

export class CommandSequenceFactory {

  private static readonly CommandClasses = [
    BeepCommand,
    BlinkCommand,
    ClearCommand,
    EchoCommand,
    InvertCommand,
    MoveToAbsoluteCommand,
    MoveToLineStartCommand,
    MoveToOriginCommand,
    MoveToRelativeCommand,
    RepeatCharacterCommand,
    SetBackgroundColorCommand,
    SetCharacterModeCommand,
    SetCharacterSizeCommand,
    SetForegroundColorCommand,
    ShowCursorCommand,
    UnderlineCommand,

    // This is the fallback command
    AddStringCommand,
  ]

  public static stringToCharCodes(s: string): Array<number> {
    return s.split('').map((c) => c.charCodeAt(0))
  }

  public static fromString(s: string): CommandSequence {
    const sequence = new CommandSequence()

    const charCodes = this.stringToCharCodes(s)

    while (charCodes.length > 0) {
      for (let i = 0; i < this.CommandClasses.length; i++) {
        const command = this.CommandClasses[i].consume(charCodes)
        if (command) {
          sequence.addToBuffer(command)
          charCodes.splice(0, command.toNumberArray().length)
          break
        }
      }
    }

    return sequence
  }

}