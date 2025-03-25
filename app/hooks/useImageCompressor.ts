import { useState, useCallback } from 'react';
import { compressImage, dataURLtoFile, fileToDataURL, CompressOptions, createAdaptiveCompressor } from '../utils/imageCompressor';

export type ImageProcessingStatus = 'idle' | 'compressing' | 'compressed' | 'error';

type CompressorHookResult = {
  compressImageFile: (file: File) => Promise<File>;
  compressDataURL: (dataURL: string, filename: string) => Promise<{
    compressedFile: File;
    compressedDataURL: string;
  }>;
  status: ImageProcessingStatus;
  stats: {
    originalSize?: number;
    compressedSize?: number;
    compressionRatio?: number;
  };
  error: Error | null;
};

export default function useImageCompressor(options?: CompressOptions): CompressorHookResult {
  const [status, setStatus] = useState<ImageProcessingStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState<{
    originalSize?: number;
    compressedSize?: number;
    compressionRatio?: number;
  }>({});

  // 使用自适应压缩器
  const adaptiveCompressor = createAdaptiveCompressor();

  // 压缩图片文件的函数
  const compressImageFile = useCallback(
    async (file: File): Promise<File> => {
      if (!file) {
        throw new Error('没有提供图片文件');
      }

      try {
        setStatus('compressing');
        setError(null);
        
        // 记录原始大小
        const originalSize = file.size;
        
        // 执行压缩
        const compressedFile = await adaptiveCompressor(file, options);
        
        // 计算压缩比
        const compressedSize = compressedFile.size;
        const compressionRatio = originalSize / compressedSize;
        
        // 更新状态
        setStats({
          originalSize,
          compressedSize,
          compressionRatio
        });
        
        setStatus('compressed');
        return compressedFile;
      } catch (err: any) {
        console.error('图片压缩失败:', err);
        setStatus('error');
        const errorMessage = err?.message || '未知错误';
        const error = new Error(`图片压缩失败: ${errorMessage}`);
        setError(error);
        
        // 出错时返回原文件，而不是抛出异常
        console.log('返回未压缩的原始文件');
        return file;
      }
    },
    [adaptiveCompressor, options]
  );

  // 压缩dataURL格式图片的函数
  const compressDataURL = useCallback(
    async (
      dataURL: string, 
      filename: string
    ): Promise<{ compressedFile: File; compressedDataURL: string }> => {
      if (!dataURL) {
        throw new Error('没有提供图片数据');
      }

      try {
        setStatus('compressing');
        setError(null);
        
        // 转换dataURL为File
        const file = dataURLtoFile(dataURL, filename);
        
        // 记录原始大小
        const originalSize = file.size;
        
        // 执行压缩
        const compressedFile = await adaptiveCompressor(file, options);
        
        // 将压缩后的文件转回dataURL
        const compressedDataURL = await fileToDataURL(compressedFile);
        
        // 如果返回的dataURL为空，表示转换失败，使用原始dataURL
        if (!compressedDataURL) {
          console.warn('压缩后的dataURL为空，使用原始dataURL');
          setStatus('error');
          setError(new Error('无法将压缩后的文件转换为dataURL'));
          return { compressedFile, compressedDataURL: dataURL };
        }
        
        // 计算压缩比
        const compressedSize = compressedFile.size;
        const compressionRatio = originalSize / compressedSize;
        
        // 更新状态
        setStats({
          originalSize,
          compressedSize,
          compressionRatio
        });
        
        setStatus('compressed');
        return { compressedFile, compressedDataURL };
      } catch (err: any) {
        console.error('图片压缩或转换失败:', err);
        setStatus('error');
        const errorMessage = err?.message || '未知错误';
        const error = new Error(`图片处理失败: ${errorMessage}`);
        setError(error);
        
        // 创建一个与原始文件相同的文件
        const originalFile = dataURLtoFile(dataURL, filename);
        
        // 出错时返回原始数据
        return { 
          compressedFile: originalFile, 
          compressedDataURL: dataURL 
        };
      }
    },
    [adaptiveCompressor, options]
  );

  return {
    compressImageFile,
    compressDataURL,
    status,
    stats,
    error
  };
}

/**
 * 创建一个自适应压缩函数，根据设备性能和图片大小调整压缩设置
 */
export function createAdaptiveCompressor() {
  // 检测设备性能
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  // 修复 deviceMemory 类型问题
  const isLowMemoryDevice = 'deviceMemory' in navigator && (navigator as any).deviceMemory < 4;
  
  // 根据设备性能设置默认值
  const defaultOptions: CompressOptions = {
    maxWidth: isMobile ? 1800 : 3000,
    maxHeight: isMobile ? 1800 : 3000,
    quality: isLowMemoryDevice ? 0.6 : (isMobile ? 0.7 : 0.9),
    maxSizeKB: isMobile ? 40096 : 51200, // 移动设备最大40MB，桌面设备50MB
    mimeType: 'image/jpeg'
  };
  
  // 返回一个封装了默认选项的压缩函数
  return async (file: File, customOptions: Partial<CompressOptions> = {}): Promise<File> => {
    const options = { ...defaultOptions, ...customOptions };
    return compressImage(file, options);
  };
} 