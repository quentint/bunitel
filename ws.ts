import AppServer from './src/AppServer.ts'
import MyTestApp from './MyTestApp.ts'

const appServer = new AppServer(() => new MyTestApp())

console.log(`Listening on localhost:${appServer.server.port}`)