import AbstractCellGrid from '../grid/AbstractCellGrid.ts'
import EventEmitter from 'events'

export default class DisplayObject {

  private _emitter: EventEmitter = new EventEmitter()
  public x: number = 0
  public y: number = 0

  protected _children: Array<DisplayObject> = []

  public get emitter() {
    return this._emitter
  }

  addChild(child: DisplayObject) {
    this._children.push(child)
  }

  addChildAt(child: DisplayObject, index: number) {
    this._children.splice(index, 0, child)
  }

  setChildIndex(child: DisplayObject, index: number) {
    const oldIndex = this._children.indexOf(child)
    if (oldIndex !== -1) {
      this._children.splice(oldIndex, 1)
      this._children.splice(index, 0, child)
    }
  }

  removeChild(child: DisplayObject) {
    const index = this._children.indexOf(child)
    if (index !== -1) {
      this._children.splice(index, 1)
    }
  }

  public getSelfGrid(): AbstractCellGrid {
    return new AbstractCellGrid()
  }

  protected addSelfGrid(toGrid: AbstractCellGrid) {
    const selfGrid = this.getSelfGrid()

    for (let y: number = selfGrid.minY; y <= selfGrid.maxY; y++) {
      for (let x: number = selfGrid.minX; x <= selfGrid.maxX; x++) {
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
      for (let y: number = childGrid.minY; y <= childGrid.maxY; y++) {
        for (let x: number = childGrid.minX; x <= childGrid.maxX; x++) {
          const cell = childGrid.get(x, y)
          if (!cell) {
            continue
          }

          grid.set(x + child.x, y + child.y, cell)
        }
      }
    })

    this.addSelfGrid(grid)

    return grid
  }

}