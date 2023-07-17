import { defineConfig, Options } from 'tsup'

export default defineConfig((options: Options) => ({
	splitting: false,
	entry: ['src/**/*.ts'],
	format: ['cjs'],
	dts: true,
	minify: true,
	clean: true,
	...options,
}))
