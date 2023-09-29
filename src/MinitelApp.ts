import MinitelStage from './ui/MinitelStage.ts'
import FocusManager from './FocusManager.ts'
import KeySequence from './KeySequence.ts'

export default abstract class MinitelApp {
  private _clientId: string | null = null

  public readonly stage: MinitelStage = new MinitelStage()
  public readonly focusManager: FocusManager

  constructor() {
    this.focusManager = new FocusManager(this.stage)
  }

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

  public async onOpen() {
    console.log(`[${this.clientId}] onOpen: Please override me!`)
  }

  public async onMessage(message) {

    // TODO: Organize events in categories
    this.focusManager.passMessage(message)

    // console.log(message.split('').map((c) => c.charCodeAt(0)))

    if (message === KeySequence.UP) {
      this.onUp()
      return
    }

    if (message === KeySequence.DOWN) {
      this.onDown()
      return
    }

    if (message === KeySequence.LEFT) {
      this.onLeft()
      return
    }

    if (message === KeySequence.RIGHT) {
      this.onRight()
      return
    }

    if (message === KeySequence.SUITE) {
      this.onSuite()
      return
    }

    if (message === KeySequence.RETOUR) {
      this.onRetour()
      return
    }
  }

  onUp() {
    // console.log(`[${this.clientId}] onUp`)
  }

  onDown() {
    // console.log(`[${this.clientId}] onDown`)
  }

  onLeft() {
    // console.log(`[${this.clientId}] onLeft`)
  }

  onRight() {
    // console.log(`[${this.clientId}] onRight`)
  }

  onTOC() {
    // console.log(`[${this.clientId}] onTOC`)
  }

  onCancel() {
    // console.log(`[${this.clientId}] onCancel`)
  }

  onSuite() {
    this.stage.emitter.emit('suite')
    // console.log(`[${this.clientId}] onSuite`)
  }

  onRetour() {
    this.stage.emitter.emit('retour')
    // console.log(`[${this.clientId}] onRetour`)
  }

  public async onClose() {
    // console.log(`[${this.clientId}] onClose: Please override me!`)
  }
}