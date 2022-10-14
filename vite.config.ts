import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import { presetMini } from 'unocss'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/my-element.ts',
      formats: ['es']
    },
    rollupOptions: {
      external: /^lit/
    }
  },
  plugins: [
    Unocss({
      mode: 'shadow-dom',
      presets: [
        presetMini()
      ]
    }),
  ]
})
