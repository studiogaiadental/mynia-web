import { defineConfig, type Connect, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Pages served from their own folder (<name>/index.html).
const PAGE_DIRS = ['admin', 'terms-and-conditions', 'privacy-policy']

// Vite's dev and preview servers only map "/admin/" to admin/index.html; a
// slash-less "/admin" falls through to the landing page. Redirect it to the
// folder, as static hosts do.
function pageTrailingSlash(): Plugin {
  const redirect: Connect.NextHandleFunction = (req, res, next) => {
    // Cast because this project has no @types/node to declare `url`.
    const [pathname, query] = ((req as { url?: string }).url ?? '').split('?')
    if (PAGE_DIRS.some((dir) => pathname === `/${dir}`)) {
      res.statusCode = 301
      res.setHeader('Location', `${pathname}/${query ? `?${query}` : ''}`)
      res.end()
      return
    }
    next()
  }
  return {
    name: 'page-trailing-slash',
    configureServer(server) {
      server.middlewares.use(redirect)
    },
    configurePreviewServer(server) {
      server.middlewares.use(redirect)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pageTrailingSlash()],
  build: {
    rollupOptions: {
      // Separate static pages (each with its own index.html + entry script) so
      // /terms-and-conditions/, /privacy-policy/ and /admin/ get real,
      // shareable URLs without needing a client-side router or server-side
      // rewrites.
      input: {
        main: './index.html',
        terms: './terms-and-conditions/index.html',
        privacy: './privacy-policy/index.html',
        admin: './admin/index.html',
      },
    },
  },
})
