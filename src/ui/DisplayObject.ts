import AbstractCellGrid from '../grid/AbstractCellGrid.ts'
import EventEmitter from 'events'
import MinitelStage from './MinitelStage.ts'
import Rect from '../grid/Rect.ts'
import StageEvent from '../event/StageEvent.ts'

export default class DisplayObject {

  private _emitter: EventEmitter = new EventEmitter()

  protected _parent: DisplayObject | null = null
  public x: number = 0
  public y: number = 0

  public focusEnabled: boolean = false
  public showCursorOnFocus: boolean = true
  public innerCursorX: number = 0
  public innerCursorY: number = 0

  public mask: Rect | null = null

  protected _children: Array<DisplayObject> = []

  public get emitter() {
    return this._emitter
  }

  public get stage(): MinitelStage | null {
    let o = this
    while (o._parent) {
      o = o._parent
    }

    return o instanceof MinitelStage ? o : null
  }

  public get parent(): DisplayObject | null {
    return this._parent
  }

  public set parent(p: DisplayObject | null) {
    if (this._parent === p) {
      return
    }

    this._parent = p
    this.emitter.emit(p ? StageEvent.ADDED : StageEvent.REMOVED)
  }

  addChild(child: DisplayObject) {
    this.addChildAt(child, this._children.length)
  }

  addChildAt(child: DisplayObject, index: number) {
    if (child.parent) {
      throw new Error('Child already has a parent')
    }

    this._children.splice(index, 0, child)
    child.parent = this

    this.requestStageUpdate()
  }

  setChildIndex(child: DisplayObject, index: number) {
    const oldIndex = this._children.indexOf(child)
    if (oldIndex !== -1) {
      this._children.splice(oldIndex, 1)
      this._children.splice(index, 0, child)
    }

    this.requestStageUpdate()
  }

  removeChild(child: DisplayObject) {
    const index = this._children.indexOf(child)
    if (index !== -1) {
      this._children.splice(index, 1)
      child.parent = null
      this.requestStageUpdate()
    }
  }

  public getSelfGrid(): AbstractCellGrid {
    return new AbstractCellGrid()
  }

  protected addSelfGrid(toGrid: AbstractCellGrid) {
    const selfGrid = this.getSelfGrid()

    for (let y: number = selfGrid.innerMinY; y <= selfGrid.innerMaxY; y++) {
      for (let x: number = selfGrid.innerMinX; x <= selfGrid.innerMaxX; x++) {
        const cell = selfGrid.get(x, y)
        if (cell) {
          toGrid.set(x, y, cell)
        }
      }
    }
  }

  public getGrid(): AbstractCellGrid {
    const grid: AbstractCellGrid = new AbstractCellGrid()

    this._children.forEach((child) => {
      const childGrid = child.getGrid()
      for (let y: number = childGrid.innerMinY; y <= childGrid.innerMaxY; y++) {
        for (let x: number = childGrid.innerMinX; x <= childGrid.innerMaxX; x++) {
          const cell = childGrid.get(x, y)
          if (!cell) {
            continue
          }

          grid.set(x + child.x, y + child.y, cell)
        }
      }
    })

    this.addSelfGrid(grid)
    if (this.mask) {
      grid.applyMask(this.mask)
    }

    return grid
  }

  public getStageCoordinates(): { x: number, y: number } {
    let x = this.x
    let y = this.y

    let o = this
    while (o._parent) {
      o = o._parent
      x += o.x
      y += o.y
    }

    return {x, y}
  }

  public collectFocusEnabledChildren(): Array<DisplayObject> {
    const focusEnabledChildren: Array<DisplayObject> = []

    this._children.forEach((child) => {
      if (child.focusEnabled) {
        focusEnabledChildren.push(child)
      }

      focusEnabledChildren.push(...child.collectFocusEnabledChildren())
    })

    return focusEnabledChildren
  }

  protected requestStageUpdate(): boolean {
    if (!this.stage) {
      return false
    }

    this.stage.requestUpdate()
    return true
  }

}