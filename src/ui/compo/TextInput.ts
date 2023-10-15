import {DisplayObject} from '../DisplayObject.ts'
import {AbstractCellGrid} from '../../grid'
import {CellColor} from '../../grid/cell'
import {Label} from './Label.ts'
import {Rect} from '../../grid'
import {FocusEvent} from '../../event'
import {KeyboardEvent} from '../../event'
import {ActionKey} from 'bunitel'

export class TextInput extends DisplayObject {

  private _width: number = 10
  private _label: Label = new Label()
  private _dots: Label = new Label()
  private _cursorIndex: number = 0
  private _previousScroll: number = 0

  public color: CellColor = CellColor.WHITE_100
  public focusEnabled: boolean = true

  public mask: Rect = new Rect()

  constructor() {
    super()

    this.mask.width = this.width
    this.mask.height = 1

    this.refreshDots()
    this.addChild(this._dots)
    this.addChild(this._label)

    this.emitter.on(FocusEvent.FOCUS, this.onFocus.bind(this))

    this.emitter.on(FocusEvent.BLUR, this.onBlur.bind(this))

    this.emitter.on(KeyboardEvent.CHARACTER_KEY, (message: string) => {
      this.addCharacterAtCursor(message)
    })

    this.emitter.on(ActionKey.CORRECTION, () => {
      this.removeCharacterAtCursor()
    })

    this.emitter.on(ActionKey.LEFT, () => {
      this.moveCursorBy(-1)
    })

    this.emitter.on(ActionKey.RIGHT, () => {
      this.moveCursorBy(1)
    })

    this.onBlur()
  }

  private onFocus() {
    this._label.x = this._previousScroll
  }

  private onBlur() {
    this._previousScroll = this._label.x
    this._label.x = 0
  }

  private moveCursorBy(offset: number) {
    if (offset === 0) {
      return
    }

    this._cursorIndex = Math.min(this.value.length, Math.max(0, this._cursorIndex + offset))

    if (offset > 0) {
      const cursorDistanceToRight = this.width - this._cursorIndex - this._label.x - 1
      if (this.value.length > this.width && cursorDistanceToRight < 2) {
        this.scrollLabelBy(-1)
      }
    } else {
      const cursorDistanceToLeft = this._cursorIndex + this._label.x
      if (this.value.length > this.width && cursorDistanceToLeft < 2) {
        this.scrollLabelBy(1)
      }
    }

    this.requestStageUpdate()
  }

  private scrollLabelBy(offset: number) {
    this._label.x = Math.min(0, Math.max(this._label.x + offset, this.width - this.value.length - 1))
  }

  public get width(): number {
    return this._width
  }

  public set width(value: number) {
    this._width = value
    this.mask.width = this.width
    this.refreshDots()
  }

  public get value(): string {
    return this._label.text
  }

  public set value(value: string) {
    this._label.text = value
  }

  private refreshDots() {
    this._dots.text = Array.from({ length: this.width }, () => '.').join('')
  }

  private addCharacterAtIndex(character: string, index: number) {
    this._label.text = this.value.slice(0, index) + character + this.value.slice(index)
    this.scrollLabelBy(-1)
  }

  private removeCharacterAtIndex(index: number) {
    this._label.text = this.value.slice(0, index) + this.value.slice(index + 1)
    this.scrollLabelBy(1)
  }

  private addCharacterAtCursor(character: string) {
    this.addCharacterAtIndex(character, this._cursorIndex)
    this._cursorIndex++
  }

  private removeCharacterAtCursor() {
    if (this._cursorIndex === 0) {
      return
    }

    this.removeCharacterAtIndex(this._cursorIndex - 1)
    this._cursorIndex = Math.max(0, this._cursorIndex - 1)
  }

  getGrid(): AbstractCellGrid {
    this.innerCursorX = this._cursorIndex + this._label.x

    return super.getGrid()
  }

}