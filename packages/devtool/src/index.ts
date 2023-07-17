import sirv from 'sirv'
import http from 'http'
import path from 'path'
import { WebSocket, WebSocketServer } from 'ws'
import { Compiler } from 'webpack'

const CLIENT_DIST_PATH = path.join(__dirname, '/client')
// const CLIENT_HTML_PATH = path.resolve(CLIENT_DIST_PATH, 'index.html')
// const NEXT_HMR_WS = 'ws://localhost:3000/_next/webpack-hmr'

type Options = {
	port: number
	host: string
}

class DevtoolPlugin {
	name = 'DevtoolPlugin'

	private ws: WebSocket | null
	private server: http.Server | null
	private options: Options

	constructor(
		options = {
			port: 3030,
			host: '127.0.0.1',
		} as Options
	) {
		this.ws = null
		this.server = null
		this.options = options

		const middleware = sirv(CLIENT_DIST_PATH, { dev: true, single: true })
		this.server = http.createServer((req, res) => {
			middleware(req, res)
		})

		const wss = new WebSocketServer({ server: this.server })
		wss.on('connection', (ws) => {
			this.ws = ws

			ws.on('message', (data) => {
				console.log('received: %s', data)
			})
		})

		process.on('SIGINT', () => {
			this.cleanup()
		})
	}

	apply(compiler: Compiler) {
		compiler.hooks.initialize.tap(this.name, () => {
			console.log('[devtool] initialize service')
			this.startServer()
		})
	}

	startServer() {
		if (!this.server) {
			return
		}
		this.server.listen(this.options.port, this.options.host, () => {
			console.log(`[devtool] server listening on ${this.options.host}:${this.options.port}`)
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
