import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.w3schools.com' },
      { protocol: 'https', hostname: 'dicoding-web-img.sgp1.cdn.digitaloceanspaces.com' },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: 'dicoding-web-img.sgp1.cdn.digitaloceanspaces.com',
      },
      
    ],
  },
};

export default nextConfig;
