export default class MosaicCharacterUtils {

  public static fromBooleanArray(sequence: boolean[]): string {
    return MosaicCharacterUtils.fromBitString(sequence.map((b) => b ? '1' : '0').join(''))
  }

  public static fromBitString(bits: string): string {
    if (bits.length !== 6) {
      throw new Error(`Expected 6 bits, got ${bits.length}`)
    }

    if (bits.replace(/[01]/g, '').length > 0) {
      throw new Error(`Expected only 0s and 1s, got ${bits}`)
    }

    return String.fromCharCode(parseInt(bits.split('').reverse().join(''), 2) + 32)
  }

}