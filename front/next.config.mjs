/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desactivar source maps en development para evitar conflictos
  productionBrowserSourceMaps: false,
  // Optimizaciones de bundle - Solo Radix UI (lucide usa imports normales)
  modularizeImports: {
    '@radix-ui/react-*': {
      transform: '@radix-ui/react-{{ member }}/dist/index.esm.js',
      skipDefaultConversion: true,
    },
  },
  // Turbopack config (empty = usa defaults)
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gbeaegtyvxncudslomvi.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'yhabiaunavez.onrender.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
