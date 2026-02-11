/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // Cambiá esto por el dominio real de tu proyecto de Supabase
        hostname: 'xxxxxxxxx.supabase.co',
        port: '',
        // Esta es la ruta estándar donde Supabase guarda los archivos públicos
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
