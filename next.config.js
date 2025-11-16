/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // ✅ Disable in dev
  runtimeCaching: [
    {
      urlPattern: /^https?:\/\/(vetconnect-backend-3\.onrender\.com)\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60
        },
        networkTimeoutSeconds: 10
      }
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60
        }
      }
    }
  ]
})

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true
}

module.exports = withPWA(nextConfig)