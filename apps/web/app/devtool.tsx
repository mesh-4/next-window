'use client'

import * as React from 'react'

const PLUGIN_OPTS = {
	port: 3030,
	host: '127.0.0.1',
}

const Devtool = () => {
	const wsRef = React.useRef<WebSocket>()
	const [showFrame, toggleFrame] = React.useState(false)

	const onToggleFrame = () => {
		toggleFrame((prev) => !prev)
	}

	// connect to websocket with plugin options
	React.useEffect(() => {
		const socket = new WebSocket(`ws://${PLUGIN_OPTS.host}:${PLUGIN_OPTS.port}`)
		socket.addEventListener('open', (event) => {
			socket.send('greeting from client')
			wsRef.current = socket
		})
	}, [])

	const onInpect = () => {
		wsRef.current?.send('inspect')
	}

	return (
		<>
			{showFrame && (
				<div className="relative w-[600px] h-[250px]">
					<iframe className="w-full h-full" title="devtool" src="http://localhost:3030" />
				</div>
			)}
			<div className="absolute bottom-6 left-1/2 -translate-x-1/2">
				<div className="bg-black text-white rounded-lg flex items-center overflow-hidden border-gray-400 shadow-lg">
					<button
						className="m-2 mr-1 w-20 p-1 rounded text-sm hover:bg-gray-700 transition-colors"
						onClick={onToggleFrame}>
						<span>Devtools</span>
					</button>
					<div className="w-[1px] h-5 bg-white mx-1" />
					<button className="m-2 ml-1 w-20 p-1 rounded text-sm hover:bg-gray-700 transition-colors" onClick={onInpect}>
						<span>Inspect</span>
					</button>
				</div>
			</div>
		</>
	)
}

export default Devtool
