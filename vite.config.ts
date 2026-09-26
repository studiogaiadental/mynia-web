import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Separate static pages (each with its own index.html + entry script) so
      // /terms-and-conditions/ and /privacy-policy/ get real, shareable URLs
      // without needing a client-side router or server-side rewrites.
      input: {
        main: './index.html',
        terms: './terms-and-conditions/index.html',
        privacy: './privacy-policy/index.html',
      },
    },
  },
})
