/** @type {import('next').NextConfig} */
const nextConfig = { 
  // output: 'export', // Temporarily disable for demo
  images: { unoptimized: true }, 
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  }
};

module.exports = nextConfig;
