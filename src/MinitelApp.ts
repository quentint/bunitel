import MinitelStage from './ui/MinitelStage.ts'

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
    console.log(`[${this.clientId}] onMessage: Please override me!`)
  }

  public async onClose() {
    console.log(`[${this.clientId}] onClose: Please override me!`)
  }
}