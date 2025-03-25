/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 增加超时时间，解决大图片处理问题
  serverRuntimeConfig: {
    staticPageGenerationTimeout: 180, // 3分钟
  },
  // 优化构建
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
    optimizePackageImports: ['lucide-react', 'i18next', 'react-i18next'],
  },
  // 优化图片处理
  images: {
    domains: ['raw.githubusercontent.com', 'tuchuang.org.cn', 'pic1.imgdb.cn', 'localhost', 'api.xinyew.cn', 'encrypted-tbn0.gstatic.com'],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  // API 设置
  api: {
    responseLimit: '8mb',
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  basePath: process.env.NEXT_PUBLIC_SKIP_BASE_PATH ? '' : '/photochatpro',
  assetPrefix: process.env.NEXT_PUBLIC_SKIP_BASE_PATH ? '' : '/photochatpro/',
  trailingSlash: true,
  distDir: 'out',
  generateBuildId: async () => 'build',
  output: 'export',
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    }
    return config
  }
};

module.exports = nextConfig;

module.exports = {
  images: { unoptimized: true }, // 禁用图片优化
  trailingSlash: true // 确保路径斜杠兼容
}