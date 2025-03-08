/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones de rendimiento
  reactStrictMode: true,
  swcMinify: true,
  
  // Optimizaciones para móviles
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Configuración de caché
  onDemandEntries: {
    // Periodo (en ms) donde las páginas se mantienen en memoria
    maxInactiveAge: 25 * 1000,
    // Número de páginas a mantener en memoria
    pagesBufferLength: 2,
  },
  
  // Configuración de webpack
  webpack: (config) => {
    // Optimizaciones personalizadas aquí si son necesarias
    return config;
  },
  
  // Headers personalizados para mejorar seguridad y rendimiento
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            // Forzar tema claro a nivel de HTTP
            key: 'Color-Scheme',
            value: 'light',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
