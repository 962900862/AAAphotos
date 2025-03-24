import sharp from 'sharp'
import { Redis } from '@upstash/redis'
import { v4 as uuidv4 } from 'uuid'

let redis: Redis | null = null;
try {
  // 检查环境变量是否存在且不是占位符值
  if (
    process.env.UPSTASH_REDIS_REST_URL && 
    process.env.UPSTASH_REDIS_REST_TOKEN &&
    process.env.UPSTASH_REDIS_REST_URL !== 'your_redis_rest_url' &&
    process.env.UPSTASH_REDIS_REST_TOKEN !== 'your_redis_rest_token'
  ) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } else {
    console.log('Redis credentials not provided or are placeholders, cache disabled');
  }
} catch (error) {
  console.warn('Redis configuration failed:', error);
  // 确保redis变量为null
  redis = null;
}

interface ImageProcessingOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
  fit?: keyof sharp.FitEnum
}

export class ImageProcessor {
  private static instance: ImageProcessor
  private cache: Redis | null

  private constructor() {
    this.cache = redis
  }

  public static getInstance(): ImageProcessor {
    if (!ImageProcessor.instance) {
      ImageProcessor.instance = new ImageProcessor()
    }
    return ImageProcessor.instance
  }

  /**
   * 处理图片
   * @param buffer 图片缓冲区
   * @param options 处理选项
   * @returns 处理后的图片缓冲区
   */
  public async processImage(
    buffer: Buffer,
    options: ImageProcessingOptions = {}
  ): Promise<Buffer> {
    const {
      width = 800,
      height = 800,
      quality = 80,
      format = 'jpeg',
      fit = 'inside',
    } = options

    // 如果有缓存，尝试从缓存获取
    if (this.cache) {
      // 生成缓存键
      const cacheKey = this.generateCacheKey(buffer, options)

      // 检查缓存
      const cachedImage = await this.getFromCache(cacheKey)
      if (cachedImage) {
        return cachedImage
      }
    }

    // 处理图片
    const processedImage = await sharp(buffer)
      .resize(width, height, {
        fit,
        withoutEnlargement: true,
      })
      .toFormat(format, { quality })
      .toBuffer()

    // 如果有缓存，保存到缓存
    if (this.cache) {
      const cacheKey = this.generateCacheKey(buffer, options)
      await this.cache.set(cacheKey, processedImage, {
        ex: Number(process.env.CACHE_TTL) || 86400,
      })
    }

    return processedImage
  }

  /**
   * 批量处理图片
   * @param buffers 图片缓冲区数组
   * @param options 处理选项
   * @returns 处理后的图片缓冲区数组
   */
  public async processImages(
    buffers: Buffer[],
    options: ImageProcessingOptions = {}
  ): Promise<Buffer[]> {
    const promises = buffers.map((buffer) => this.processImage(buffer, options))
    return Promise.all(promises)
  }

  /**
   * 生成缓存键
   * @param buffer 图片缓冲区
   * @param options 处理选项
   * @returns 缓存键
   */
  private generateCacheKey(
    buffer: Buffer,
    options: ImageProcessingOptions
  ): string {
    const hash = this.hashBuffer(buffer)
    const optionsString = JSON.stringify(options)
    return `image:${hash}:${optionsString}`
  }

  /**
   * 从缓存获取图片
   * @param key 缓存键
   * @returns 图片缓冲区
   */
  private async getFromCache(key: string): Promise<Buffer | null> {
    if (!this.cache) return null
    const cached = await this.cache.get(key)
    return cached ? Buffer.from(cached as string) : null
  }

  /**
   * 计算缓冲区哈希值
   * @param buffer 缓冲区
   * @returns 哈希值
   */
  private hashBuffer(buffer: Buffer): string {
    // 使用简单的哈希算法，实际项目中可以使用更复杂的算法
    let hash = 0
    for (let i = 0; i < buffer.length; i++) {
      const char = buffer[i]
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(36)
  }

  /**
   * 清理过期缓存
   */
  public async cleanupCache(): Promise<void> {
    // 实现缓存清理逻辑
    // 这里可以使用 Redis 的 SCAN 命令来清理过期的缓存
  }
} 