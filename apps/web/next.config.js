const path = require('path')
const DevtoolPlugin = require('@shit/next-window')

/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
		if (!isServer) {
			config.plugins.push(new DevtoolPlugin())
		}

		return config
	},
}

/*
const originalEntry = config.entry
config.entry = async () => {
	const entries = await originalEntry()

	if (entries['main-app']) {
		const viewPath = path.join(__dirname, 'view-dist/assets/index.js')
		if (!entries['main-app'].includes(viewPath)) {
			entries['main-app'].push(viewPath)
		}
	}
	console.log(entries)
	return entries
}
*/
