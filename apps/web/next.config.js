class CustomWebpackPlugin {
	apply(compiler) {
		compiler.hooks.done.tap('CustomWebpackPlugin', (stats) => {
			console.log(stats)
			console.log('Hello from plugin')
		})
	}
}

/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
		if (!isServer) {
			// TODO use it for start rpc connection
			const establishRpcConnection = () => {
				console.log('Establishing RPC connection...')
				// Your RPC logic here
			}
			establishRpcConnection()

			const originalEntry = config.entry
			config.entry = async () => {
				const entries = await originalEntry()
				// console.log(entries)

				// TODO maybe should use it to insert devtool interface
				/*
				if (
					entries['main.js'] &&
					!entries['main.js'].includes('./client/polyfills.js')
				) {
					entries['main.js'].unshift('./client/polyfills.js')
				}
				*/

				return entries
			}

			config.plugins.push(new CustomWebpackPlugin())
		}

		return config
	},
}
