import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone', // <--- WAJIB TAMBAHKAN INI
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  allowedDevOrigins: ['192.168.0.100'],
};

export default nextConfig;