import GridType from './GridType.ts'
import ClearCell from './cell/ClearCell.ts'

export default class Grid<T> {

  private _grid: GridType<T> = {}

  get minY(): number {
    return Math.min(...Object.keys(this._grid).map(y => parseInt(y)))
  }

  get maxY(): number {
    return Math.max(...Object.keys(this._grid).map(y => parseInt(y)))
  }

  get minX(): number {
    return Math.min(...Object.keys(this._grid).map(y => Math.min(...Object.keys(this._grid[parseInt(y)]).map(x => parseInt(x)))))
  }

  get maxX(): number {
    return Math.max(...Object.keys(this._grid).map(y => Math.max(...Object.keys(this._grid[parseInt(y)]).map(x => parseInt(x)))))
  }

  get width(): number {
    return this.maxX - this.minX + 1
  }

  get height(): number {
    return this.maxY - this.minY + 1
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

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
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

  diff(before: Grid<T>, maxX: number, maxY: number, minX: number = 0, minY: number = 0): Grid<T> {
    let diff: Grid<T> = new Grid<T>()

    for (let y: number = minY; y <= maxY; y++) {
      for (let x: number = minX; x <= maxX; x++) {
        const beforeCell = before.get(x, y)
        const afterCell = this.get(x, y)

        if (beforeCell && !afterCell) {
          diff.set(x, y, new ClearCell())
          continue
        }

        if (beforeCell && afterCell && afterCell.toCellData().equals(beforeCell.toCellData())) {
          continue
        }

        if (afterCell) {
          diff.set(x, y, afterCell)
        }

      }
    }

    return diff
  }

  public trim(width: number, height: number) {
    for (let y = this.minY; y <= this.maxY; y++) {
      for (let x = this.minX; x <= this.maxX; x++) {
        if (x < 0 || x > width || y < 0 || y > height && this._grid[y] && this._grid[y][x]) {
          try {
            delete this._grid[y][x]
          } catch (e) {}
        }
      }
    }
  }

}