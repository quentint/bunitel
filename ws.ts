import WebSocketData from "./src/WebSocketData.ts"
import ServerWebSocketMinitelBridge from "./src/ServerWebSocketMinitelBridge.ts"

const bridges = new Map<string, ServerWebSocketMinitelBridge>()

const server = Bun.serve<WebSocketData>({
  fetch(req, server) {
    const success = server.upgrade(req, {
      data: {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      }
    });
    if (success) {
      // Bun automatically returns a 101 Switching Protocols
      // if the upgrade succeeds
      return undefined;
    }

    // handle HTTP request normally
    return new Response("Nothing here.");
  },
  websocket: {
    open(ws) {
      const bridge = new ServerWebSocketMinitelBridge(ws);
      bridges.set(ws.data.id, bridge)
      bridge.onOpen()
    },
    async message(ws, message) {
      const bridge = bridges.get(ws.data.id)
      if (bridge) {
        bridge.onMessage(message)
      } else {
        console.error(`No bridge found for ${ws.data.id}`)
      }
    },
    close(ws, code, message) {
      // console.log('close', ws.data.id, code, message)
      bridges.delete(ws.data.id)
    }
  },
});

console.log(`Listening on localhost:${server.port}`);