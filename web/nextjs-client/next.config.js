/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'images.unsplash.com', 'via.placeholder.com'],
    unoptimized: true, // Important for production deployment
  },
  trailingSlash: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-e7zjf3b6pq-uc.a.run.app',
  },
}

module.exports = nextConfig
