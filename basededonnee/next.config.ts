/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    turbo: false,
    serverActions: { bodySizeLimit: '110mb' },
  },
  async redirects() {
    return [
      { source: '/api/vacance-annees', destination: '/api/vacance/annees', permanent: false },
      { source: '/api/vacance-repartition-sexe', destination: '/api/vacance/repartition-sexe', permanent: false },
      { source: '/api/vacance-repartition-classe', destination: '/api/vacance/repartition-classe', permanent: false },
      { source: '/api/vacance-presence-rate-section', destination: '/api/vacance/presence-rate-section', permanent: false },
      {
        source: '/api/vacance-presence-rate-evolution/:startYear/:endYear',
        destination: '/api/vacance/presence-rate-evolution/:startYear/:endYear',
        permanent: false,
      },
      {
        source: '/api/vacance-evolution/:startYear/:endYear',
        destination: '/api/vacance/evolution/:startYear/:endYear',
        permanent: false,
      },
    ];
  },
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