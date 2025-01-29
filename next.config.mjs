/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // Use the backend URL defined in .env.local
        destination: `${process.env.API_URL}/api/:path*`, // Backend API URL for server-side calls
      },
    ];
  },
  images: {
    domains: ['trackfusionweb-storage.s3.us-east-2.amazonaws.com'],
    remotePatterns: [
      { // azure
        protocol: "https",
        hostname: "useraudiostorage.blob.core.windows.net",
        port: "",
        pathname: "/**",
      },
      { // aws
        protocol: "https",
        hostname: "trackfusionweb-storage.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      }
    ],
  },
};

export default nextConfig;
