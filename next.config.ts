// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      'http://172.20.10.6:3000', // your network IP
      'http://localhost:3000',   // localhost
    ],
  },
};

export default nextConfig;
