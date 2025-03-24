import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// 创建 Redis 客户端（仅在配置存在时）
let redis: Redis | null = null
let ratelimit: Ratelimit | null = null

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })

    // 创建速率限制器
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(
        Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
        `${Number(process.env.RATE_LIMIT_WINDOW) || 3600000}ms`
      ),
      analytics: true,
    })
  }
} catch (error) {
  console.warn('Redis configuration failed:', error)
}

// 验证文件类型
const ALLOWED_IMAGE_TYPES = (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png').split(',')
const MAX_IMAGE_SIZE = Number(process.env.MAX_IMAGE_SIZE) || 5 * 1024 * 1024 // 5MB

export async function middleware(request: NextRequest) {
  // 只处理 API 路由
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // 速率限制（仅在 Redis 配置存在时）
  if (ratelimit) {
    const ip = request.ip ?? '127.0.0.1'
    const { success, limit, reset, remaining } = await ratelimit.limit(ip)

    if (!success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      })
    }
  }

  // 文件上传验证
  if (request.method === 'POST' && request.nextUrl.pathname.startsWith('/api/upload')) {
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return new NextResponse('Invalid Content Type', { status: 400 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return new NextResponse('No file uploaded', { status: 400 })
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return new NextResponse('Invalid file type', { status: 400 })
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return new NextResponse('File too large', { status: 400 })
    }
  }

  // 添加安全头
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
  )

  return response
}

export const config = {
  matcher: '/api/:path*',
} 