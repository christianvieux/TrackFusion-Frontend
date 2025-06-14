/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: `${process.env.API_URL}/api/:path*`,
    },
  ],
  images: {
    remotePatterns: [
      ...(process.env.NEXT_PUBLIC_ALLOWED_IMAGE_DOMAINS?.split(',') || []).map(domain => ({
        protocol: 'https',
        hostname: domain,
        port: '',
        pathname: '/**',
      })),
    ],
  },
};

export default nextConfig;