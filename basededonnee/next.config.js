// next.config.js
module.exports = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    domains: ['localhost', 'aspnktkfjifbnhjcdepv.supabase.co'],
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
};
