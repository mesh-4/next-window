class CustomWebpackPlugin {
	apply(compiler: any) {
		compiler.hooks.done.tap('CustomWebpackPlugin', (_stats: any) => {
			console.log('Hello from plugin')
		})
	}
}

export default CustomWebpackPlugin
