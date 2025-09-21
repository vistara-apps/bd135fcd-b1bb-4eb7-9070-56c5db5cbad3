/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'schedulr.app'],
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: false
  },
  eslint: {
    ignoreDuringBuilds: false
  }
};

export default nextConfig;
