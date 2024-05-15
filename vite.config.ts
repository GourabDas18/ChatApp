import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
      // PWA plugin options
      manifest: {
        name: 'My PWA App',
        short_name: 'My PWA',
        icons: [
          {
            src: '/chat.png',
            sizes: '128x128',
            type: 'image/png',
          },
          // ... other icon configurations
        ],
        start_url: '/',
        display: 'standalone',
        theme_color: '#000000',
        background_color: '#ffffff',
      },
      injectManifest: {
        // ... options for manifest injection (optional)
      }
    }),
  ],
})
