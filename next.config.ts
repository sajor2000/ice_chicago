import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress Mapbox GL JS warnings
  transpilePackages: ['mapbox-gl'],
  
  // Webpack configuration
  webpack: (config) => {
    // Ignore mapbox-gl warnings
    config.resolve.alias = {
      ...config.resolve.alias,
      'mapbox-gl': 'mapbox-gl/dist/mapbox-gl.js',
    };
    
    return config;
  },
};

export default nextConfig;
