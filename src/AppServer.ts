import WebSocketData from './WebSocketData.ts'
import * as Bun from 'bun'
import {Server} from 'bun'
import MinitelApp from './MinitelApp.ts'
import CommandSequence from './command/CommandSequence.ts'
import StageEvent from './event/StageEvent.ts'
import ShowCursorCommand from './command/ShowCursorCommand.ts'
import MoveToAbsoluteCommand from './command/MoveToAbsoluteCommand.ts'

export default class AppServer<T extends MinitelApp> {

  private readonly _server: Server
  private readonly _bridges: Map<string, T>

  constructor(_appFactory: () => T) {
    this._bridges = new Map<string, T>()

    this._server = Bun.serve<WebSocketData>({
      fetch(req, server) {
        const success = server.upgrade(req, {
          data: {
            id: crypto.randomUUID(),
            createdAt: Date.now(),
          },
        })
        if (success) {
          // Bun automatically returns a 101 Switching Protocols
          // if the upgrade succeeds
          return undefined
        }

        // handle HTTP request normally
        return new Response('Nothing here.')
      },
      websocket: {
        open: async (ws) => {
          const app = _appFactory()
          app.initClientId(ws.data.id)

          app.stage.emitter.on(StageEvent.UPDATE, (sequence: CommandSequence) => {

            const activeElement = app.focusManager.activeElement
            if (activeElement && activeElement.showCursorOnFocus) {
              sequence.addToBuffer(new ShowCursorCommand(true))
              const offset = activeElement.getStageCoordinates()
              sequence.addToBuffer(new MoveToAbsoluteCommand(offset.x + activeElement.innerCursorX, offset.y + activeElement.innerCursorY))
            } else {
              sequence.addToBuffer(new ShowCursorCommand(true))
            }

            const data = sequence.bufferToString()

            ws.send(data)

            return data
          })

          this._bridges.set(ws.data.id, app)

          await app.onOpen()
        },

        message: async (ws, message) => {
          const app = this._bridges.get(ws.data.id)
          if (app) {
            await app.onMessage(message)
          } else {
            console.error(`No bridge found for ${ws.data.id}`)
          }
        },

        close: async (ws, code, message) => {
          const app = this._bridges.get(ws.data.id)
          if (app) {
            await app.onClose()
          }
          this._bridges.delete(ws.data.id)
        },
      },
    })
  }

  public get server(): Server {
    return this._server
  }

}