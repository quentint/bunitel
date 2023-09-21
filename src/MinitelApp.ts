import MinitelStage from './ui/MinitelStage.ts'

// const specialKeys = {
//   up: '[A',
//   down: '[B',
//   // right: '[C',
//   left: '[D',
//
//   sommaire: 'F',
//   annulation: 'E',
//   retour: 'B',
//   repetition: 'C',
//   guide: 'D',
//   correction: 'G',
//   suite: 'H',
//   envoi: 'A',
// }

function sequenceToString(sequence: number[]): string {
  return sequence.map((c) => String.fromCharCode(c)).join('')
}

const UP = sequenceToString([27, 91, 65])
const DOWN = sequenceToString([27, 91, 66])
const RIGHT = sequenceToString([27, 91, 67])
const LEFT = sequenceToString([27, 91, 68])

export default abstract class MinitelApp {
  private _clientId: string | null = null
  private readonly _stage: MinitelStage = new MinitelStage()

  public initClientId(clientId: string) {
    if (this._clientId) {
      console.warn('Client ID already set. Ignoring.')
      return
    }
    this._clientId = clientId
  }

  public get clientId(): string {
    if (!this._clientId) {
      throw new Error('Client ID not set')
    }

    return this._clientId
  }

  public get stage(): MinitelStage {
    return this._stage
  }

  public async onOpen() {
    console.log(`[${this.clientId}] onOpen: Please override me!`)
  }

  public async onMessage(message) {

    // const sequence = message.split('').map((c) => c.charCodeAt(0))

    if (message === UP) {
      this.onUp()
      return
    }

    if (message === DOWN) {
      this.onDown()
      return
    }

    if (message === LEFT) {
      this.onLeft()
      return
    }

    if (message === RIGHT) {
      this.onRight()
      return
    }

    // console.log(`[${this.clientId}] onMessage(${message}): Please override me!`)

    // if (message === specialKeys.up) {
    //   this.onUp()
    //   return
    // }
    //
    // if (message === specialKeys.down) {
    //   this.onDown()
    //   return
    // }
    //
    // if (message === specialKeys.sommaire) {
    //   this.onTOC()
    //   return
    // }
    //
    // if (message === specialKeys.annulation) {
    //   this.onCancel()
    //   return
    // }
  }

  onUp() {
    console.log(`[${this.clientId}] onUp`)
  }

  onDown() {
    console.log(`[${this.clientId}] onDown`)
  }

  onLeft() {
    console.log(`[${this.clientId}] onLeft`)
  }

  onRight() {
    console.log(`[${this.clientId}] onRight`)
  }

  onTOC() {
    console.log(`[${this.clientId}] onTOC`)
  }

  onCancel() {
    console.log(`[${this.clientId}] onCancel`)
  }

  public async onClose() {
    console.log(`[${this.clientId}] onClose: Please override me!`)
  }
}