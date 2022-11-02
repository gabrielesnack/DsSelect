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
        { "input-inner": "border-none outline-0 text-sm c-gray-700 pointer-events-auto" },
        { "select": "position-relative flex items-center justify-start gap-2 h-10 border rounded shadow-md outline-0 pr-4 pl-2 cursor-pointer text-sm c-gray-700 placeholder:c-gray-300" },
        { "select--normal": "border-gray-300 focus-within:b-sky-500" },
        { "select--error": "border-rose-400 focus-within:b-rose-600" },
        { "select-chevron": "transition-all transition-duration-200 fill-gray-400 w-3 position-absolute right-3 top-4" },
        { "select-chevron--down": "-rotate-180" },
        { "menu": "position-absolute left-0 w-full z-index-50 border rounded b-gray-300 shadow-md box-shadow py-2 bg-white" },
        { "menu--dropup": "bottom-full mb-2"},
        { "menu--dropdown": "top-full mt-2"},
        { "select-item": "text-sm c-gray-700 cursor-pointer py-2 px-4 hover:bg-slate-200 " },
        { "select-item--selected": "flex justify-between c-sky-500 hover:c-sky-500 fill-sky-500 font-bold" }
      ]
    }),
  ]
})
