import DisplayObject from "./DisplayObject.ts"
import AbstractCellGrid from '../grid/AbstractCellGrid.ts'

export default class MinitelStage extends DisplayObject {
  static WIDTH: number = 40
  static HEIGHT: number = 25

  getGrid(): AbstractCellGrid {
    const grid = super.getGrid()
    grid.trim(MinitelStage.WIDTH, MinitelStage.HEIGHT)

    return grid
  }
}