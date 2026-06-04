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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://sdk.mercadopago.com https://img.icons8.com https://www.google.com; connect-src 'self' https://yhabiaunavez.onrender.com https://gbeaegtyvxncudslomvi.supabase.co https://api.mercadopago.com http://localhost:3000; img-src 'self' data: blob: https://gbeaegtyvxncudslomvi.supabase.co https://images.unsplash.com https://img.icons8.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src 'self' https://www.google.com https://sdk.mercadopago.com;",
          },
        ],
      },
    ];
  },
}

export default nextConfig
