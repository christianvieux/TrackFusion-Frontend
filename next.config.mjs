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
