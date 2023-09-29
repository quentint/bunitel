import EventEmitter from 'events'
import ActionKey from '../ActionKey.ts'

export default class KeyboardEvent {
  public static readonly ACTION_KEY = 'actionKey'
  public static readonly CHARACTER_KEY = 'characterKey'

  public static emitMessageEvents(message: string, target: EventEmitter) {
    const knownSequence = ActionKey.isKnownSequence(message)
    if (knownSequence) {
      // Global event
      target.emit(KeyboardEvent.ACTION_KEY, message)

      // Action-specific event
      target.emit(message)

      return
    }

    // Generic character event
    target.emit(KeyboardEvent.CHARACTER_KEY, message)
  }
}