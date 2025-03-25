import { NextRequest, NextResponse } from 'next/server'
import { ImageProcessor } from '@/lib/imageProcessor'

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // 判断是否是移动设备
    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    // 验证文件类型
    const allowedTypes = (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png').split(',')
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      )
    }

    // 验证文件大小 - 移动设备限制为4MB，桌面设备限制为10MB
    const maxSize = isMobile 
      ? Number(process.env.MOBILE_MAX_IMAGE_SIZE) || 4 * 1024 * 1024 // 4MB for mobile
      : Number(process.env.MAX_IMAGE_SIZE) || 10 * 1024 * 1024 // 10MB for desktop
      
    if (file.size > maxSize) {
      const errorMessage = isMobile 
        ? 'File too large. Mobile uploads limited to 4MB.'
        : 'File too large. Maximum size is 10MB.';
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 413 }
      )
    }

    // 读取文件内容
    const buffer = Buffer.from(await file.arrayBuffer())

    // 处理图片
    const processor = ImageProcessor.getInstance()
    const processedImage = await processor.processImage(buffer, {
      width: 800,
      height: 800,
      quality: 80,
      format: 'jpeg',
      fit: 'inside'
    })

    // 返回处理后的图片
    return new NextResponse(processedImage, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': processedImage.length.toString()
      }
    })
  } catch (error) {
    console.error('Error processing image:', error)
    return NextResponse.json(
      { error: 'Error processing image' },
      { status: 500 }
    )
  }
} 