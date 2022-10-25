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
      ],
      shortcuts: [
        { "tag": "flex items-center gap-2 border rounded py-1 px-2 bg-gray-100 border-color-gray-200 c-gray-500 font-light text-xs" },
        { "input": "h-10 border rounded shadow-md outline-0 px-4 cursor-pointer text-sm c-gray-700" },
        { "input--normal": "b-gray-300 focus-visible:b-sky-500 placeholder:c-gray-300 " },
        { "input--error": "border-rose-400 focus-visible:b-rose-600" },
        { "select": "border rounded b-gray-300 shadow-md box-shadow mt-2 py-2 position-absolute w-full z-index-50 bg-white" },
        { "select-item": "text-sm c-gray-700 cursor-pointer py-2 px-4 hover:bg-slate-200 " },
        { "select-item--selected": "flex justify-between c-sky-500 hover:c-sky-500 fill-sky-500 font-bold" }
      ]
    }),
  ]
})
