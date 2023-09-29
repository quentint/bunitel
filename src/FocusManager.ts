import MinitelStage from './ui/MinitelStage.ts'
import DisplayObject from './ui/DisplayObject.ts'
import ActionKey from './ActionKey.ts'
import FocusEvent from './event/FocusEvent.ts'
import KeyboardEvent from './event/KeyboardEvent.ts'

export default class FocusManager {

  private _activeElement: DisplayObject | null = null

  constructor(private readonly _stage: MinitelStage) {
    _stage.emitter.on(ActionKey.SUITE, () => this.focusNext())
    _stage.emitter.on(ActionKey.RETOUR, () => this.focusPrevious())
  }

  public set activeElement(item: DisplayObject | null) {
    if (item === this._activeElement) {
      return
    }

    if (this._activeElement) {
      this._activeElement.emitter.emit(FocusEvent.BLUR)
    }

    this._activeElement = item

    if (this._activeElement) {
      this._activeElement.emitter.emit(FocusEvent.FOCUS)
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

    KeyboardEvent.emitMessageEvents(message, this._activeElement.emitter)
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