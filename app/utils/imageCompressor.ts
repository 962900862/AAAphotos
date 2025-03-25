/**
 * 客户端图片压缩工具
 * 用于在上传前压缩大图片，减少服务器负担和请求时间
 */

export type CompressOptions = {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
  mimeType?: string;
};

/**
 * 压缩图片文件
 * @param file 要压缩的图片文件
 * @param options 压缩选项
 * @returns 压缩后的File对象
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const {
    maxWidth = 3000,
    maxHeight = 3000,
    quality = 0.7,
    maxSizeKB = 51200, // 默认50MB
    mimeType = 'image/jpeg'
  } = options;

  // 如果文件已经小于最大大小，直接返回
  if (file.size <= maxSizeKB * 1024) {
    console.log('图片已经足够小，无需压缩');
    return file;
  }

  // 从文件创建图片
  const imageBitmap = await createImageBitmap(file);
  
  // 计算调整后的尺寸，保持纵横比
  let width = imageBitmap.width;
  let height = imageBitmap.height;
  
  if (width > height) {
    if (width > maxWidth) {
      height = Math.floor(height * (maxWidth / width));
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.floor(width * (maxHeight / height));
      height = maxHeight;
    }
  }
  
  // 创建canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  // 绘制图片到canvas
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('无法获取canvas上下文');
    return file;
  }
  
  ctx.drawImage(imageBitmap, 0, 0, width, height);
  
  // 递归压缩函数，如果图片仍然太大，就降低质量再试
  const compress = async (currentQuality: number): Promise<Blob> => {
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('Blob创建失败');
            // 创建失败时返回空blob
            resolve(new Blob([], { type: mimeType }));
            return;
          }
          
          // 如果还是太大且质量还可以降低，继续压缩
          if (blob.size > maxSizeKB * 1024 && currentQuality > 0.1) {
            console.log(`优化后仍超过大小限制 (${(blob.size / 1024 / 1024).toFixed(1)}MB)，进一步优化中...`);
            resolve(compress(currentQuality - 0.1));
          } else {
            // 压缩完成
            console.log(`优化完成: ${(blob.size / 1024 / 1024).toFixed(1)}MB，质量: ${currentQuality.toFixed(1)}`);
            resolve(blob);
          }
        },
        mimeType,
        currentQuality
      );
    });
  };
  
  // 开始压缩
  const compressedBlob = await compress(quality);
  
  // 创建新的File对象
  const compressedFile = new File(
    [compressedBlob],
    file.name.replace(/\.\w+$/, '.jpg'), // 将文件扩展名改为.jpg
    { type: mimeType }
  );
  
  console.log(`原图大小: ${(file.size / 1024 / 1024).toFixed(1)}MB, 优化后: ${(compressedFile.size / 1024 / 1024).toFixed(1)}MB`);
  return compressedFile;
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
    maxWidth: isMobile ? 2400 : 3000,
    maxHeight: isMobile ? 2400 : 3000,
    quality: isLowMemoryDevice ? 0.6 : 0.7,
    maxSizeKB: 51200, // 50MB，移动设备和桌面设备统一限制
    mimeType: 'image/jpeg'
  };
  
  // 返回一个封装了默认选项的压缩函数
  return async (file: File, customOptions: Partial<CompressOptions> = {}): Promise<File> => {
    const options = { ...defaultOptions, ...customOptions };
    return compressImage(file, options);
  };
}

/**
 * 将dataURL转换为File对象
 */
export function dataURLtoFile(dataURL: string, filename: string): File {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
}

/**
 * 将File对象转换为dataURL
 */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
} 