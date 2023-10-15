import {MinitelStage} from './ui'
import {FocusManager} from './FocusManager.ts'
import {KeyboardEvent} from './event'

export abstract class MinitelApp {
  private _clientId: string | null = null

  public readonly stage: MinitelStage
  public readonly focusManager: FocusManager

  protected constructor() {
    this.stage = new MinitelStage()
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

  public async onMessage(message: string) {

    // console.log(message.split('').map((c) => c.charCodeAt(0)))

    this.focusManager.passMessage(message)
    KeyboardEvent.emitMessageEvents(message, this.stage.emitter)
  }

  public async onClose() {}
}