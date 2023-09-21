import DisplayObject from "./DisplayObject.ts"
import DisplayMatrix from "../types/DisplayMatrix.ts"

export default class MinitelStage extends DisplayObject {
  static WIDTH: number = 40
  static HEIGHT: number = 25

  getStageEmptyMatrix(): DisplayMatrix {
    return DisplayObject.getEmptyMatrix(MinitelStage.WIDTH, MinitelStage.HEIGHT)
  }

  getMatrix(): DisplayMatrix {
    const matrix = super.getMatrix()

    const trimmedMatrix = {}
    for (let y = 0; y < MinitelStage.HEIGHT; y++) {
      trimmedMatrix[y] = {}
      for (let x = 0; x < MinitelStage.WIDTH; x++) {
        if (matrix[y] && matrix[y][x]) {
          trimmedMatrix[y][x] = matrix[y][x]
        }
      }
    }

    return trimmedMatrix
  }
}