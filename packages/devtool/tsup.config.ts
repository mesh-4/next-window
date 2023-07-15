import { defineConfig, Options } from 'tsup'

export default defineConfig((options: Options) => ({
	entry: ['mod/index.ts'],
	format: ['cjs', 'esm'],
	minify: true,
	splitting: false,
	sourcemap: true,
	clean: true,
	...options,
}))
