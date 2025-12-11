
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'KitaBuddy - #JomCegahBuli',
        short_name: 'KitaBuddy',
        description: 'Your friendly AI learning companion for stories, chat, and discovery.',
        theme_color: '#FDFBF7',
        background_color: '#FDFBF7',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.tailwindcss\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tailwind-cdn-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
             urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
             handler: 'StaleWhileRevalidate',
             options: {
               cacheName: 'google-fonts-cache',
               cacheableResponse: {
                 statuses: [0, 200]
               }
             }
           },
           {
             urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
             handler: 'CacheFirst',
             options: {
               cacheName: 'gstatic-fonts-cache',
               expiration: {
                 maxEntries: 10,
                 maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
               },
               cacheableResponse: {
                 statuses: [0, 200]
               }
             }
           }
        ]
      }
    })
  ],
});