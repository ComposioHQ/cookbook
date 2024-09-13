import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // proxy to twitter api
  server: {
    proxy: {
      '/twitter': {
        target: 'https://api.twitter.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/twitter/, ''),
      },
    },
  },
})
