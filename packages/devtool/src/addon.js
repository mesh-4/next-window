const { sources, Compilation, Compiler } = require('webpack')
const sirv = require('sirv')
const http = require('http')
const path = require('path')
const fs = require('fs/promises')
const { WebSocketServer } = require('ws')

const CLIENT_DIST_PATH = path.join(__dirname, '..', '/client/dist')
const CLIENT_HTML_PATH = path.resolve(CLIENT_DIST_PATH, 'index.html')
const NEXT_HMR_WS = 'ws://localhost:3000/_next/webpack-hmr'

const PLUGIN_OPTS = {
	port: 3030,
	host: '127.0.0.1',
}

class DevtoolPlugin {
	constructor() {
		this.name = 'DevtoolPlugin'
		this.ws = null
		this.server = null

		process.on('SIGINT', () => {
			this.cleanup()
		})
	}

	apply(compiler) {
		compiler.hooks.initialize.tap(this.name, () => {
			console.log('[devtool] initialize service')
			this.startServer()
		})
	}

	assignWS(ws) {
		this.ws = ws
	}

	async startServer() {
		const sirvMiddleware = sirv(CLIENT_DIST_PATH, { dev: true, single: true })
		const html = await fs.readFile(CLIENT_HTML_PATH, 'utf-8')

		this.server = http.createServer((req, res) => {
			if (req.method === 'GET' && req.url === '/') {
				res.writeHead(200, { 'Content-Type': 'text/html' })
				res.end(html)
			} else {
				sirvMiddleware(req, res)
			}
		})

		const wss = new WebSocketServer({ server: this.server })
		// on connection assign ws into plugin

		wss.on('connection', (ws) => {
			console.log(`[devtool] websocket connection`)

			ws.on('message', function message(data) {
				console.log('received: %s', data)
			})

			// on inpect event, console log "[devtool] Inpect"
			ws.on('inspect', () => {
				console.log('[devtool] Inspect')
			})

			this.assignWS(ws)
		})

		await new Promise((resolve) => {
			this.server.listen(PLUGIN_OPTS.port, PLUGIN_OPTS.host, () => {
				console.log(`Devtool server listening on ${PLUGIN_OPTS.host}:${PLUGIN_OPTS.port}`)
				resolve()
			})
		})
	}

	async cleanup() {
		console.log('[devtool] cleanup')
		if (this.ws) {
			this.ws.close()
			this.ws = null
		}
		if (this.server) {
			this.server.close()
			this.server = null
		}
		process.exit()
	}
}

module.exports = DevtoolPlugin
