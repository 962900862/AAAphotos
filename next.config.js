/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['raw.githubusercontent.com', 'tuchuang.org.cn', 'pic1.imgdb.cn', 'localhost', 'api.xinyew.cn'],
    unoptimized: true,
  },
  basePath: process.env.NEXT_PUBLIC_SKIP_BASE_PATH ? '' : '/photochatpro',
  assetPrefix: process.env.NEXT_PUBLIC_SKIP_BASE_PATH ? '' : '/photochatpro/',
  trailingSlash: true,
  distDir: 'out',
  generateBuildId: async () => 'build',
  // 移除output: 'export'配置以支持API路由
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    }
    return config
  }
};

module.exports = nextConfig; 