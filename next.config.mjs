/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: (
            process.env.NEXT_PUBLIC_ALLOWED_IMAGE_DOMAINS?.split(',') ?? []
        ).map((domain) => ({
            protocol: 'https',
            hostname: domain.trim(),
            port: '',
            pathname: '/**',
        })),
    },
};

export default nextConfig;