import {encode} from "uqr"
import {DisplayObject} from '../DisplayObject.ts'
import {AbstractCellGrid} from '../../grid'
import {Grid} from '../../grid'
import {MosaicCell} from '../../grid/cell'
import {MosaicCharacterUtils} from '../../grid/cell/utils'
import {CellColor} from '../../grid/cell'

export class QrCode extends DisplayObject {

  public foregroundColor: CellColor = CellColor.DEFAULT_BACKGROUND
  public backgroundColor: CellColor = CellColor.DEFAULT_FOREGROUND

  constructor(public text: string) {
    super()
  }

  public getSelfGrid(): AbstractCellGrid {
    const {data: qrMatrix} = encode(this.text)
    const qrGrid = new Grid<boolean>()

    const resultGrid = new Grid<MosaicCell>()

    qrMatrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        qrGrid.set(x, y, cell)
      })
    })

    const splitGrid = qrGrid.groupCells(2, 3)

    for (let y: number = 0; y < splitGrid.innerHeight; y++) {
      for (let x: number = 0; x < splitGrid.innerWidth; x++) {
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