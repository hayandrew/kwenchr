import { defineConfig, transformWithOxc } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const transformJsxInJs = () => ({
  name: 'transform-jsx-in-js',
  enforce: 'pre',
  async transform(code, id) {
    if (id.includes('node_modules')) return null
    if (!id.match(/.*\.(js|jsx)$/)) return null
    return await transformWithOxc(code, id, { lang: 'jsx' })
  },
})

export default defineConfig({
  plugins: [transformJsxInJs(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
