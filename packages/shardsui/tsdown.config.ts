import path from 'node:path'
import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: ['src/index.ts', 'src/components/*/index.ts'],
  format: 'esm',
  platform: 'browser',
  unbundle: true,
  clean: true,
  alias: {
    '@': path.resolve(import.meta.dirname, 'src')
  },
  deps: {
    neverBundle: ['vue', 'esm-env']
  },
  plugins: [Vue({ isProduction: true })],
  dts: {
    vue: true
  }
})
