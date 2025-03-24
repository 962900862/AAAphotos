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

    // 验证文件类型
    const allowedTypes = (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png').split(',')
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      )
    }

    // 验证文件大小
    const maxSize = Number(process.env.MAX_IMAGE_SIZE) || 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large' },
        { status: 400 }
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