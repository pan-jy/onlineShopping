import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: ['src/components', 'src/pages'],
      resolvers: [VantResolver()]
    })
  ],
  resolve: {
    alias: {
      '@/': '/src/'
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://practicetb.supsy.xyz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
