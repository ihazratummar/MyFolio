/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // Ignore TypeScript and ESLint errors during build (for Docker)
    // Remove these in production for stricter checks
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;

