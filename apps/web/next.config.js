/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@email-system/ui', '@email-system/types'],
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
