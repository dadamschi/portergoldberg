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
