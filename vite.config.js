import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'CZ Timer',
        short_name: 'CZ Timer',
        description: 'Star Citizen CZ Timer for Pyro Contested Zones, Executive Hangars, keycard cooldowns, compboards, vault doors, and Carinite cave runs.',
        theme_color: '#0a0e1a',
        background_color: '#0a0e1a',
        display: 'standalone',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // timer-config.json must never be served stale — keep it out of the
        // precache and fetch it network-first at runtime instead.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        globIgnores: ['**/timer-config.json'],
        navigateFallbackDenylist: [/\/timer-config\.json$/],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname === '/timer-config.json',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'timer-config',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 1 },
            },
          },
          {
            // Live WebSocket/API backend — never cache.
            urlPattern: ({ url }) => url.hostname.endsWith('.workers.dev'),
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
  base: '/', // Root path for custom domain (cztimer.com)
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  }
})
