import {encode} from "uqr"
import DisplayObject from '../DisplayObject.ts'
import AbstractCellGrid from '../../grid/AbstractCellGrid.ts'
import Grid from '../../grid/Grid.ts'
import MosaicCell from '../../grid/cell/MosaicCell.ts'
import MosaicCharacterUtils from '../../grid/cell/utils/MosaicCharacterUtils.ts'
import CellColor from '../../grid/cell/CellColor.ts'

export default class QrCode extends DisplayObject {

  public foregroundColor: CellColor = CellColor.WHITE_100
  public backgroundColor: CellColor = CellColor.BLACK_0

  constructor(public text: string) {
    super()
  }

  protected getSelfGrid(): AbstractCellGrid {
    const {data: qrMatrix} = encode(this.text)
    const qrGrid = new Grid<boolean>()

    const resultGrid = new Grid<MosaicCell>()

    qrMatrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        qrGrid.set(x, y, cell)
      })
    })

    const splitGrid = qrGrid.groupCells(2, 3)

    for (let y: number = 0; y < splitGrid.height; y++) {
      for (let x: number = 0; x < splitGrid.width; x++) {
        const twoByThreeCell = splitGrid.get(x, y)
        if (twoByThreeCell) {
          const sequence: Array<boolean> = []
          for (let i: number = 0; i < 3; i++) {
            for (let j: number = 0; j < 2; j++) {
              sequence.push(twoByThreeCell.get(j, i) || false)
            }
          }

          const mosaicCell = new MosaicCell(MosaicCharacterUtils.fromBooleanArray(sequence))
          mosaicCell.foregroundColor = this.foregroundColor
          mosaicCell.backgroundColor = this.backgroundColor

          resultGrid.set(x, y, mosaicCell)
        }

      }
    }

    return resultGrid
  }

}