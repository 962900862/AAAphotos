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
 * 检查是否支持 createImageBitmap
 * Vercel 环境中可能不支持
 */
const isCreateImageBitmapSupported = () => {
  return typeof window !== 'undefined' && 'createImageBitmap' in window;
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
    console.log('图片已经足够小，无需优化');
    return file;
  }

  try {
    // 加载图片并获取尺寸
    const dimensions = await getImageDimensions(file);
    const { width: originalWidth, height: originalHeight } = dimensions;

    // 计算调整后的尺寸，保持纵横比
    let width = originalWidth;
    let height = originalHeight;
    
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

    // 绘制图片
    await drawImageToCanvas(file, ctx, 0, 0, width, height);
  
    // 开始压缩
    const compressedBlob = await compressCanvasToBlob(canvas, file, mimeType, quality, maxSizeKB);
  
    // 创建新的File对象
    const compressedFile = new File(
      [compressedBlob],
      file.name.replace(/\.\w+$/, '.jpg'), // 将文件扩展名改为.jpg
      { type: mimeType }
    );
  
    console.log(`原图大小: ${(file.size / 1024 / 1024).toFixed(1)}MB, 优化后: ${(compressedFile.size / 1024 / 1024).toFixed(1)}MB`);
    return compressedFile;
  } catch (error) {
    console.error('图片优化过程中出错:', error);
    // 出错时返回原文件
    return file;
  }
}

/**
 * 获取图片尺寸
 */
async function getImageDimensions(file: File): Promise<{width: number, height: number}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        width: img.width,
        height: img.height
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('加载图片失败'));
    };
    
    img.src = objectUrl;
  });
}

/**
 * 绘制图片到Canvas
 */
async function drawImageToCanvas(
  file: File, 
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  width: number, 
  height: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      ctx.drawImage(img, x, y, width, height);
      URL.revokeObjectURL(objectUrl);
      resolve();
    };
    
    img.onerror = (error) => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('绘制图片到Canvas失败'));
    };
    
    img.src = objectUrl;
  });
}

/**
 * 将Canvas压缩为Blob
 */
async function compressCanvasToBlob(
  canvas: HTMLCanvasElement,
  originalFile: File,
  mimeType: string,
  initialQuality: number,
  maxSizeKB: number
): Promise<Blob> {
  // 递归压缩函数
  const compress = async (currentQuality: number): Promise<Blob> => {
    return new Promise((resolve) => {
      // 检查是否支持toBlob
      if (!canvas.toBlob) {
        // 回退到toDataURL
        try {
          const dataUrl = canvas.toDataURL(mimeType, currentQuality);
          const byteString = atob(dataUrl.split(',')[1]);
          const mimeMatch = dataUrl.match(/:(.*?);/);
          const mime = mimeMatch ? mimeMatch[1] : mimeType;
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          
          const blob = new Blob([ab], { type: mime });
          
          if (blob.size > maxSizeKB * 1024 && currentQuality > 0.1) {
            console.log(`优化后仍超过大小限制 (${(blob.size / 1024 / 1024).toFixed(1)}MB)，进一步优化中...`);
            resolve(compress(currentQuality - 0.1));
          } else {
            console.log(`优化完成: ${(blob.size / 1024 / 1024).toFixed(1)}MB，质量: ${currentQuality.toFixed(1)}`);
            resolve(blob);
          }
        } catch (e) {
          console.error('toDataURL 失败:', e);
          resolve(new Blob([originalFile], { type: mimeType }));
        }
        return;
      }
      
      // 使用toBlob压缩
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('Blob创建失败');
            resolve(new Blob([originalFile], { type: mimeType }));
            return;
          }
          
          if (blob.size > maxSizeKB * 1024 && currentQuality > 0.1) {
            console.log(`优化后仍超过大小限制 (${(blob.size / 1024 / 1024).toFixed(1)}MB)，进一步优化中...`);
            resolve(compress(currentQuality - 0.1));
          } else {
            console.log(`优化完成: ${(blob.size / 1024 / 1024).toFixed(1)}MB，质量: ${currentQuality.toFixed(1)}`);
            resolve(blob);
          }
        },
        mimeType,
        currentQuality
      );
    });
  };
  
  // 开始压缩过程
  return compress(initialQuality);
}

/**
 * 创建一个自适应压缩函数，根据设备性能和图片大小调整压缩设置
 */
export function createAdaptiveCompressor() {
  // 检测设备性能
  const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  // 修复 deviceMemory 类型问题
  const isLowMemoryDevice = typeof navigator !== 'undefined' && 'deviceMemory' in navigator && (navigator as any).deviceMemory < 4;
  
  // 根据设备性能设置默认值
  const defaultOptions: CompressOptions = {
    maxWidth: isMobile ? 1800 : 3000,
    maxHeight: isMobile ? 1800 : 3000,
    quality: isLowMemoryDevice ? 0.6 : (isMobile ? 0.7 : 0.9),
    maxSizeKB: isMobile ? 40960 : 51200, // 移动设备最大40MB，桌面设备50MB
    mimeType: 'image/jpeg'
  };
  
  // 返回一个封装了默认选项的压缩函数
  return async (file: File, customOptions: Partial<CompressOptions> = {}): Promise<File> => {
    try {
      const options = { ...defaultOptions, ...customOptions };
      return await compressImage(file, options);
    } catch (err) {
      console.error('压缩过程中出错:', err);
      // 出错时返回原文件
      return file;
    }
  };
}

/**
 * 将dataURL转换为File对象
 */
export function dataURLtoFile(dataURL: string, filename: string): File {
  try {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
  } catch (error) {
    console.error('dataURL转File失败:', error);
    // 创建一个空的文件对象作为回退
    return new File([], filename, { type: 'image/jpeg' });
  }
}

/**
 * 将File对象转换为dataURL
 */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.onerror = (e) => {
        console.error('fileToDataURL 失败:', e);
        // 出错时返回空字符串
        resolve('');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('fileToDataURL 过程中出错:', error);
      resolve('');
    }
  });
} 