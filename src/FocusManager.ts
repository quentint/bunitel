import MinitelStage from './ui/MinitelStage.ts'
import DisplayObject from './ui/DisplayObject.ts'
import KeySequence from './KeySequence.ts'

export default class FocusManager {

  private _activeElement: DisplayObject | null = null

  constructor(private readonly _stage: MinitelStage) {
    _stage.emitter.on('suite', () => this.focusNext())
    _stage.emitter.on('retour', () => this.focusPrevious())
  }

  public set activeElement(item: DisplayObject | null) {
    if (item === this._activeElement) {
      return
    }

    if (this._activeElement) {
      this._activeElement.emitter.emit('blur')
    }

    this._activeElement = item

    if (this._activeElement) {
      this._activeElement.emitter.emit('focus')
    }

    this._stage.requestUpdate()
  }

  public get activeElement(): DisplayObject | null {
    return this._activeElement
  }

  private focusOffset(offset: number): void {

    if (offset === 0) {
      return
    }

    const children = this._stage.collectFocusEnabledChildren().sort((a, b) => {

      const aOffset = a.getStageCoordinates()
      const bOffset = b.getStageCoordinates()

      if (aOffset.y < bOffset.y) {
        return -1
      }

      if (aOffset.y > bOffset.y) {
        return 1
      }

      if (aOffset.x < bOffset.y) {
        return -1
      }

      if (aOffset.x > bOffset.x) {
        return 1
      }

      return 0
    })

    if (this._activeElement && !children.includes(this._activeElement)) {
      this.activeElement = null
    }

    if (children.length === 0) {
      return
    }

    if (!this._activeElement) {
      this.activeElement = children[0]
      return
    }

    const index = children.indexOf(this._activeElement)
    if (index > -1) {
      this.activeElement = null
      const targetIndex = (index + offset + children.length) % children.length
      if (children[targetIndex]) {
        this.activeElement = children[targetIndex]
      }
    }
  }

  private focusNext() {
    this.focusOffset(1)
  }

  private focusPrevious() {
    this.focusOffset(-1)
  }

  public passMessage(message: string) {
    if (!this._activeElement) {
      return
    }

    if (message === KeySequence.CORRECTION) {
      this._activeElement.emitter.emit('backspace', message)
      return
    }

    if (message === KeySequence.LEFT) {
      this._activeElement.emitter.emit('leftArrow', message)
      return
    }

    if (message === KeySequence.RIGHT) {
      this._activeElement.emitter.emit('rightArrow', message)
      return
    }

    // TODO: Handle more characters :)
    if (/^[a-zA-Z0-9]$/.test(message)) {
      this._activeElement.emitter.emit('character', message)
    }
  }

  public focus(displayObject: DisplayObject): boolean {
    const items = this._stage.collectFocusEnabledChildren()
    const item = items.find((item: DisplayObject) => item === displayObject)
    if (item) {
      this.activeElement = item
      return true
    }

    return false
  }

}