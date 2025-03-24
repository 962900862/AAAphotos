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