import WebSocketData from './WebSocketData.ts'
import * as Bun from 'bun'
import MinitelApp from './MinitelApp.ts'
import CommandSequence from './command/CommandSequence.ts'
import StageEvent from './event/StageEvent.ts'
import ShowCursorCommand from './command/ShowCursorCommand.ts'
import MoveToAbsoluteCommand from './command/MoveToAbsoluteCommand.ts'
import Elysia from 'elysia'
import {staticPlugin} from '@elysiajs/static'
import {html} from '@elysiajs/html'

// globalThis is not replaced on HMR
declare global {
  let liveReloadWebSocket: any
}

export default class AppServer<T extends MinitelApp> {

  private readonly _bridges: Map<string, T>

  constructor(_appFactory: () => T, options: { liveReload?: boolean } = {}) {
    this._bridges = new Map<string, T>()

    let liveReloadApp: Elysia<WebSocketData>

    if (options.liveReload) {
      console.log('Live reload enabled')
      // noinspection TypeScriptValidateTypes
      liveReloadApp = new Elysia<WebSocketData>()
      .ws('/live-reload', {
        open: async (ws) => {
          globalThis.liveReloadWebSocket = ws
        },
      })
      .listen(process.env.LIVE_RELOAD_PORT ?? 3001)
    }

    const browserPaths = [
        'app',
        'css',
        'font',
        'import',
        'library',
        'sound',
    ]

    // noinspection TypeScriptValidateTypes
    const elysia = new Elysia<WebSocketData>().use(html())

    // Serve "browser" static assets
    browserPaths.forEach(browserPath => {
      elysia.use(staticPlugin({
        assets: `node_modules/@quentin.t/miedit/${browserPath}`,
        prefix: `/${browserPath}`,
        alwaysStatic: true,
      }))
    })

    elysia.get('/', async () => {
      let template = await Bun.file('templates/browser.template.html').text()

      template = template.replaceAll('{hostname}', elysia.server?.hostname.toString())
      .replaceAll('{port}', elysia.server?.port.toString())

      if (liveReloadApp) {
        const liveReloadTemplate = await Bun.file('templates/live-reload.template.html').text()

        template = template.replaceAll('</body>', `${liveReloadTemplate}</body>`)
        template = template.replaceAll('{liveReloadHostname}', liveReloadApp.server?.hostname.toString())
        .replaceAll('{liveReloadPort}', liveReloadApp.server?.port.toString())
      }

      return template
    })
    .ws('/ws', {
      open: (ws) => {
        ws.data.id = crypto.randomUUID()
        ws.data.createdAt = Date.now()

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

        app.onOpen()
      },
      message: (ws, message) => {
        const app = this._bridges.get(ws.data.id)
        if (app) {
          app.onMessage(message)
        } else {
          console.error(`No bridge found for ${ws.data.id}`)
        }
      },
      close: (ws, code, message) => {
        const app = this._bridges.get(ws.data.id)
        if (app) {
          app.onClose()
        }
        this._bridges.delete(ws.data.id)
      },
    })
    .listen(process.env.PORT ?? 3000, () => {
      if (globalThis.liveReloadWebSocket) {
        globalThis.liveReloadWebSocket.send('reload')
      }
    })

    console.log(`Listening on http://${elysia.server?.hostname}:${elysia.server?.port}`)
  }

}