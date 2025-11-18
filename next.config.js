/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false,
  
  buildExcludes: [
    /middleware-manifest\.json$/,
    /app-build-manifest\.json$/,
    /_buildManifest\.js$/,
    /_ssgManifest\.js$/,
  ],
  
  // ⭐ UPDATED: Better caching for Next.js App Router
  runtimeCaching: [
    // 1. HTML pages - NetworkFirst with longer timeout
    {
      urlPattern: ({ request, url }) => {
        return request.mode === 'navigate' || 
               url.pathname.startsWith('/dashboard/farmer')
      },
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages-cache',
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        },
      },
    },

    // 2. RSC (React Server Components) - Critical for Next.js App Router
    {
      urlPattern: ({ url }) => {
        // Match RSC requests (/_next/data/ or ?_rsc=)
        return url.pathname.includes('/_next/data/') ||
               url.search.includes('_rsc=') ||
               url.pathname.match(/\.rsc$/)
      },
      handler: 'NetworkFirst',
      options: {
        cacheName: 'rsc-data-cache',
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },

    // 3. API requests
    {
      urlPattern: ({ url }) => {
        return url.origin === 'http://localhost:5000' ||
               url.hostname === 'vetconnect-backend-3.onrender.com'
      },
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },

    // 4. Next.js static files (_next/static)
    {
      urlPattern: ({ url }) => url.pathname.startsWith('/_next/static/'),
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-static-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },

    // 5. Next.js webpack HMR (only in dev)
    {
      urlPattern: ({ url }) => url.pathname.includes('webpack'),
      handler: 'NetworkOnly',
      options: {
        cacheName: 'webpack-cache',
      },
    },

    // 6. Images
    {
      urlPattern: ({ request }) => request.destination === 'image',
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },

    // 7. Fonts
    {
      urlPattern: ({ request }) => request.destination === 'font',
      handler: 'CacheFirst',
      options: {
        cacheName: 'fonts-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },

    // 8. Google Fonts
    {
      urlPattern: ({ url }) => 
        url.origin === 'https://fonts.googleapis.com' ||
        url.origin === 'https://fonts.gstatic.com',
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-cache',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        },
      },
    },

    // 9. Manifest
    {
      urlPattern: ({ url }) => url.pathname === '/manifest.json',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'manifest-cache',
      },
    },
  ],

  // Offline fallback
  fallbacks: {
    document: '/offline',
  },
})

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {
    domains: ['vetconnect-backend-3.onrender.com', 'localhost'],
    unoptimized: true,
  },

  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ]
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

module.exports = withPWA(nextConfig)