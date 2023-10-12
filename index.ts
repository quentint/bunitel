import AppServer from './src/AppServer.ts'
import MyTestApp from './MyTestApp.ts'

const argv = require('minimist')(process.argv.slice(2))

const appServer = new AppServer(() => new MyTestApp(), {
  liveReload: argv['live-reload'],
})