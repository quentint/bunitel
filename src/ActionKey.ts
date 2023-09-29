function sequenceToString(sequence: number[]): string {
  return sequence.map((c) => String.fromCharCode(c)).join('')
}

export default class ActionKey {
  // Actions
  static readonly ENVOI = sequenceToString([19, 65])
  static readonly RETOUR = sequenceToString([19, 66])
  static readonly REPETITION = sequenceToString([19, 67])
  static readonly GUIDE = sequenceToString([19, 68])
  static readonly ANNULATION = sequenceToString([19, 69])
  // static readonly ESCAPE = sequenceToString([19, 69])
  static readonly SOMMAIRE = sequenceToString([19, 70])
  static readonly CORRECTION = sequenceToString([19, 71])
  static readonly SUITE = sequenceToString([19, 72])

  // Arrows
  static readonly UP = sequenceToString([27, 91, 65])
  static readonly DOWN = sequenceToString([27, 91, 66])
  static readonly RIGHT = sequenceToString([27, 91, 67])
  static readonly LEFT = sequenceToString([27, 91, 68])

  static isKnownSequence(sequence: string): string|null {
    for (let key of Object.keys(ActionKey)) {
      if (ActionKey[key] === sequence) {
        return key
      }
    }

    return null
  }
}