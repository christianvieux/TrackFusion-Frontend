/** @type {import('next').NextConfig} */
const nextConfig = {
  // Added to redirect to new deployment
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://trackfusionweb.com/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_URL}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "useraudiostorage.blob.core.windows.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;