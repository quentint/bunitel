import DisplayMatrix from "../types/DisplayMatrix.ts"
import Cell from "./Cell.ts"

export default class DisplayObject {
  public x: number = 0
  public y: number = 0

  protected _children: Array<DisplayObject> = []

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

  public getSelfMatrix(): DisplayMatrix {
    return {}
  }

  static getEmptyMatrix(width: number, height: number): DisplayMatrix {
    const matrix: DisplayMatrix = {}
    for (let y = 0; y < height; y++) {
      matrix[y] = {}
      for (let x = 0; x < width; x++) {
        matrix[y][x] = new Cell()
      }
    }

    return matrix
  }

  protected addSelfMatrix(toGrid: DisplayMatrix) {
    const selfMatrix = this.getSelfMatrix()

    for (let y: number in selfMatrix) {
      const row = selfMatrix[y]
      for (let x: number in row) {
        const cell = row[x]
        if (!toGrid[y]) {
          toGrid[y] = {}
        }
        toGrid[y][x] = cell
      }
    }
  }

  public getMatrix(): DisplayMatrix {
    const matrix: DisplayMatrix = {}

    this._children.forEach((child) => {
      const childMatrix = child.getMatrix()
      for (let y in childMatrix) {
        const targetY = Number(y) + child.y

        for (let x in childMatrix[y]) {
          const cell = childMatrix[y][x]

          const targetX = Number(x) + child.x

          if (!matrix[targetY]) {
            matrix[targetY] = {}
          }

          matrix[targetY][targetX] = cell
        }
      }
    })

    this.addSelfMatrix(matrix)
    this.fillEmptyCells(matrix)

    return matrix
  }

  protected computeMatrixSize(matrix: DisplayMatrix): { width: number, height: number } {
    let width = 0
    let height = 0

    for (let y in matrix) {
      height = Math.max(height, Number(y) + 1)
      for (let x in matrix[y]) {
        width = Math.max(width, Number(x) + 1)
      }
    }

    return { width, height }
  }

  protected fillEmptyCells(matrix: DisplayMatrix) {
    const { width, height } = this.computeMatrixSize(matrix)

    for (let y = 0; y < height; y++) {
      if (!matrix[y]) {
        matrix[y] = {}
      }
      for (let x = 0; x < width; x++) {
        if (!matrix[y][x]) {
          matrix[y][x] = new Cell()
        }
      }
    }
  }

  // public getMatrixAsText(): string {
  //   const matrix = this.getMatrix()
  //   return matrix.map((row) => {
  //     return row.map((cell) => {
  //       return cell.char
  //     }).join("")
  //   }).join("\n")
  // }

}