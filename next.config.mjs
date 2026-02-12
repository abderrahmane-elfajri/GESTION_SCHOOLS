/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SWC minification for faster builds
  swcMinify: true,
  
  // Optimize production builds
  compress: true,
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['pdf-lib', 'exceljs', '@supabase/supabase-js'],
  },
  
  // Performance optimizations
  poweredByHeader: false,
};

export default nextConfig;
