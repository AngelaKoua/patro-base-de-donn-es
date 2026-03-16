/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  experimental: { turbo: false },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'aspnktkfjifbnhjcdepv.supabase.co',
      },
    ],
  },
}
module.exports = nextConfig