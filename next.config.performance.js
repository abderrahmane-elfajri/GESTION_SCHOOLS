/**
 * Performance Optimization Configuration
 * Add to next.config.js
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SWC minification for faster builds
  swcMinify: true,
  
  // Optimize production builds
  compress: true,
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Reduce compilation time
  modularizeImports: {
    '@/components': {
      transform: '@/components/{{member}}',
    },
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['pdf-lib', 'exceljs'],
  },
  
  // Image optimization
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },
};

module.exports = nextConfig;
