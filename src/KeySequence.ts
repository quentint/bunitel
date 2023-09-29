function sequenceToString(sequence: number[]): string {
  return sequence.map((c) => String.fromCharCode(c)).join('')
}

export default class KeySequence {
  static readonly UP = sequenceToString([27, 91, 65])
  static readonly DOWN = sequenceToString([27, 91, 66])
  static readonly RIGHT = sequenceToString([27, 91, 67])
  static readonly LEFT = sequenceToString([27, 91, 68])
  static readonly SUITE = sequenceToString([19, 72])
  static readonly RETOUR = sequenceToString([19, 66])
  static readonly CORRECTION = sequenceToString([19, 71])
}