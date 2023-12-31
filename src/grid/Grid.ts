import {GridType} from './GridType.ts'
import {ClearCell} from './cell'
import {Rect} from './Rect.ts'

export class Grid<T> {

  private _grid: GridType<T> = {}

  get innerMinY(): number {
    return Math.min(...Object.keys(this._grid).map(y => parseInt(y)))
  }

  get innerMaxY(): number {
    return Math.max(...Object.keys(this._grid).map(y => parseInt(y)))
  }

  get innerMinX(): number {
    return Math.min(...Object.keys(this._grid).map(y => Math.min(...Object.keys(this._grid[parseInt(y)]).map(x => parseInt(x)))))
  }

  get innerMaxX(): number {
    return Math.max(...Object.keys(this._grid).map(y => Math.max(...Object.keys(this._grid[parseInt(y)]).map(x => parseInt(x)))))
  }

  get innerWidth(): number {
    return this.innerMaxX - this.innerMinX + 1
  }

  get innerHeight(): number {
    return this.innerMaxY - this.innerMinY + 1
  }

  get cells(): GridType<T> {
    return this._grid
  }

  set(x: number, y: number, value: T) {
    if (!this._grid[y]) {
      this._grid[y] = {}
    }
    this._grid[y][x] = value
  }

  get(x: number, y: number): T | undefined {
    if (!this._grid[y]) {
      return undefined
    }

    return this._grid[y][x]
  }

  setRow(y: number, items: { [key: number]: T }) {
    this._grid[y] = items
  }

  static fromFactory<T>(width: number, height: number, factory: (x: number, y: number) => T | undefined): Grid<T> {
    const grid = new Grid<T>()
    for (let y = 0; y < height; y++) {
      const row: { [key: number]: T } = {}
      for (let x = 0; x < width; x++) {
        const generated = factory(x, y)
        if (generated) {
          row[x] = generated
        }
      }

      if (Object.keys(row).length > 0) {
        grid.setRow(y, row)
      }
    }

    return grid
  }

  static fromMatrix<T>(matrix: Array<Array<T>>): Grid<T> {
    const grid = new Grid<T>()
    matrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        grid.set(x, y, cell)
      })
    })

    return grid
  }

  groupCells(groupWidth: number, groupHeight: number): Grid<Grid<T>> {
    const groupedGrid = new Grid<Grid<T>>()

    // Note: We ignore cells in the negative space

    for (let y = 0; y < this.innerHeight; y++) {
      for (let x = 0; x < this.innerWidth; x++) {
        const groupedGridTargetX = Math.floor(x / groupWidth)
        const groupedGridTargetY = Math.floor(y / groupHeight)

        if (!groupedGrid.get(groupedGridTargetX, groupedGridTargetY)) {
          groupedGrid.set(groupedGridTargetX, groupedGridTargetY, new Grid<T>())
        }

        const item = this.get(x, y)
        if (item) {
          groupedGrid.get(groupedGridTargetX, groupedGridTargetY)!.set(x % groupWidth, y % groupHeight, item)
        }
      }
    }

    return groupedGrid
  }

  diff(before: Grid<T>, maxX: number, maxY: number, clearCellFactory: () => T, cellEqualityChecker: (afterCell: T, beforeCell: T) => boolean, minX: number = 0, minY: number = 0): Grid<T> {
    let diff: Grid<T> = new Grid<T>()

    for (let y: number = minY; y <= maxY; y++) {
      for (let x: number = minX; x <= maxX; x++) {
        const beforeCell = before.get(x, y)
        const afterCell = this.get(x, y)

        if (beforeCell && !afterCell) {
          diff.set(x, y, clearCellFactory())
          continue
        }

        if (beforeCell && afterCell && cellEqualityChecker(afterCell, beforeCell)) {
          continue
        }

        if (afterCell) {
          diff.set(x, y, afterCell)
        }

      }
    }

    return diff
  }

  public applyMask(mask: Rect) {
    for (let y = this.innerMinY; y <= this.innerMaxY; y++) {
      for (let x = this.innerMinX; x <= this.innerMaxX; x++) {
        if (x < mask.x || x >= mask.width || y < mask.y || y >= mask.height && this._grid[y] && this._grid[y][x]) {
          try {
            delete this._grid[y][x]
          } catch (e) {}
        }
      }
    }
  }

}