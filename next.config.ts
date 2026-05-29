import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https: https://cdn.sanity.io",
              "font-src 'self' data:",
              "connect-src 'self' https://www.google-analytics.com https://cdn.sanity.io https://vitals.vercel-insights.com https://vercel.live",
              "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://vercel.live",
              "media-src 'self' blob:",
            ].join('; '),
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      {
        source: '/:all*(mp4|webm|ogg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/buy',
        destination: '/buying',
        permanent: true,
      },
      {
        source: '/lets-connect',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/our-trusted-vendors',
        destination: '/client-resources',
        permanent: true,
      },
      {
        source: '/local-school-guidance',
        destination: '/client-resources',
        permanent: true,
      },

      
    ]
  },
}

export default nextConfig
