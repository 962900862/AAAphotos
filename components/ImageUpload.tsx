import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  onUpload: (file: File) => Promise<void>
  maxSize?: number
  accept?: string[]
}

export function ImageUpload({
  onUpload,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = ['image/jpeg', 'image/png'],
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      // 验证文件大小
      if (file.size > maxSize) {
        setError(`文件大小不能超过 ${maxSize / (1024 * 1024)}MB`)
        return
      }

      // 验证文件类型
      if (!accept.includes(file.type)) {
        setError('不支持的文件类型')
        return
      }

      // 创建预览
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // 上传文件
      try {
        setIsUploading(true)
        setError(null)
        await onUpload(file)
      } catch (err) {
        setError('上传失败，请重试')
        console.error('Upload error:', err)
      } finally {
        setIsUploading(false)
      }
    },
    [onUpload, maxSize, accept]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': accept,
    },
    maxFiles: 1,
  })

  const removePreview = () => {
    setPreview(null)
    setError(null)
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200 ease-in-out
          ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }
        `}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative">
            <div className="relative w-full h-64">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                removePreview()
              }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600">
              {isDragActive
                ? '释放文件以上传'
                : '拖放文件到此处，或点击选择文件'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              支持 {accept.join(', ')} 格式
            </p>
          </div>
        )}
      </div>

      {isUploading && (
        <div className="mt-4 flex items-center justify-center text-blue-500">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span>处理中...</span>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
      )}
    </div>
  )
} 