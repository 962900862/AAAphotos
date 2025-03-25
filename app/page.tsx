"use client";

import { useState, useRef, useEffect } from "react";
import { 
  ImagePlus, 
  Sparkles, 
  Share2, 
  Wand2, 
  X,
  Download,
  BookOpen,
  MessageCircle,
  MaximizeIcon,
  ChevronDown,
  Star,
  CheckCircle2,
  ZapIcon,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useTranslation } from "react-i18next";

// 创建一个简单的全局锁定机制
let translationInProgress = false;

// 处理点击事件的全局函数
const handleGlobalClick = (e: MouseEvent) => {
  // 检查如果翻译正在进行中，则阻止所有点击
  if (translationInProgress) {
    e.stopPropagation();
    e.preventDefault();
    console.log("系统正在处理中，请稍等...");
    return false;
  }
  return true;
};

// 扩展Window接口以支持翻译相关的全局属性和方法
declare global {
  interface Window {
    siteLanguage?: string;
    translationDict?: Record<string, string>;
    originalTexts?: Map<any, string>;
    translate?: () => boolean;
    translationObserver?: MutationObserver;
    pauseTranslation?: () => void;
    resumeTranslation?: () => void;
    reapplyTranslations?: () => void;
    domLock?: boolean;
    translationInProgress?: boolean;
  }
}

export default function Home() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [processedImages, setProcessedImages] = useState<{
    wechat: string | null;
    xiaohongshu: string | null;
    '4k': string | null;
  }>({
    wechat: null,
    xiaohongshu: null,
    '4k': null
  });
  const [processedDimensions, setProcessedDimensions] = useState<{
    wechat: { width: number, height: number };
    xiaohongshu: { width: number, height: number };
    '4k': { width: number, height: number };
  }>({
    wechat: { width: 0, height: 0 },
    xiaohongshu: { width: 0, height: 0 },
    '4k': { width: 0, height: 0 }
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'wechat' | 'xiaohongshu' | '4k'>('wechat');
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [modeChanged, setModeChanged] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const uploadZoneRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // 全屏功能
  const toggleFullscreen = () => {
    // 检查系统是否正在处理中
    if (typeof window !== 'undefined' && window.translationInProgress) {
      console.log("系统正在处理中，请等待操作完成后再尝试切换全屏");
      toast({
        variant: "destructive",
        title: "请稍等",
        description: "系统正在处理中，请等待完成后再操作",
      });
      return;
    }
    
    try {
      // 确保容器引用有效
      if (!imageContainerRef.current || !document.body.contains(imageContainerRef.current)) {
        console.error('无法获取有效的图片容器引用');
        return;
      }
      
      if (!document.fullscreenElement) {
        // 进入全屏
        imageContainerRef.current.requestFullscreen()
          .then(() => {
            setIsFullscreen(true);
          })
          .catch(err => {
            console.error("全屏模式失败:", err);
            toast({
              variant: "destructive",
              title: "全屏模式失败",
              description: `错误: ${err.message}`,
            });
          });
      } else {
        // 退出全屏
        document.exitFullscreen()
          .then(() => {
            setIsFullscreen(false);
          })
          .catch(err => {
            console.error("退出全屏失败:", err);
          });
      }
    } catch (error) {
      console.error("全屏切换出错:", error);
    }
  };

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 添加全局点击事件拦截
  useEffect(() => {
    // 定义事件处理函数
    function globalEventHandler(e: MouseEvent) {
      if (window.translationInProgress) {
        // 如果翻译正在进行，阻止所有点击
        e.stopPropagation();
        e.preventDefault();
        console.log("系统正在处理中，请稍等...");
      }
    }
    
    // 在捕获阶段注册，先于其他事件处理程序执行
    document.addEventListener('click', globalEventHandler, true);
    
    // 清理函数
    return () => {
      document.removeEventListener('click', globalEventHandler, true);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 添加文件大小限制（50MB）
    const maxSizeInBytes = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSizeInBytes) {
      toast({
        variant: "destructive",
        title: t('notifications.upload.sizeLimit.title') || "文件过大",
        description: t('notifications.upload.sizeLimit.description', { size: '50MB' }) || "上传图片最大限制为50MB",
      });
      return;
    }
    
    if (file.type === "image/jpeg" || file.type === "image/png") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        
        // 获取图片尺寸并预处理图片
        const img = new Image();
        img.onload = async () => {
          setImageDimensions({ width: img.width, height: img.height });
          
          // 对于大图片，使用朋友圈超清参数进行预处理
          let processedDataUrl = dataUrl;
          if (img.width > 2048) {
            // 使用微信朋友圈超清处理参数（短边1080px，等比例缩放）
            const ratio = img.height / img.width;
            let targetWidth, targetHeight;
            
            if (img.width < img.height) {
              // 图片是竖向的，宽度是短边
              targetWidth = 1080;
              targetHeight = Math.round(targetWidth * ratio);
            } else {
              // 图片是横向的，高度是短边
              targetHeight = 1080;
              targetWidth = Math.round(targetHeight / ratio);
            }
            
            // 创建canvas进行处理
            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
              processedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
            }
          }
          
          // 更新状态
          setUploadedImage(processedDataUrl);
          setProcessedImage(null);
          // 重置所有模式的处理结果
          setProcessedImages({
            wechat: null,
            xiaohongshu: null,
            '4k': null
          });
          setProgress(0);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    // 添加文件大小限制（50MB）
    const maxSizeInBytes = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSizeInBytes) {
      toast({
        variant: "destructive",
        title: t('notifications.upload.sizeLimit.title') || "文件过大",
        description: t('notifications.upload.sizeLimit.description', { size: '50MB' }) || "上传图片最大限制为50MB",
      });
      return;
    }
    
    if (file.type === "image/jpeg" || file.type === "image/png") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        
        // 获取图片尺寸并预处理图片
        const img = new Image();
        img.onload = async () => {
          setImageDimensions({ width: img.width, height: img.height });
          
          // 对于大图片，使用朋友圈超清参数进行预处理
          let processedDataUrl = dataUrl;
          if (img.width > 2048) {
            // 使用微信朋友圈超清处理参数（短边1080px，等比例缩放）
            const ratio = img.height / img.width;
            let targetWidth, targetHeight;
            
            if (img.width < img.height) {
              // 图片是竖向的，宽度是短边
              targetWidth = 1080;
              targetHeight = Math.round(targetWidth * ratio);
            } else {
              // 图片是横向的，高度是短边
              targetHeight = 1080;
              targetWidth = Math.round(targetHeight / ratio);
            }
            
            // 创建canvas进行处理
            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
              processedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
            }
          }
          
          // 更新状态
          setUploadedImage(processedDataUrl);
          setProcessedImage(null);
          // 重置所有模式的处理结果
          setProcessedImages({
            wechat: null,
            xiaohongshu: null,
            '4k': null
          });
          setProgress(0);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const removeUploadedImage = () => {
    // 检查系统是否正在处理中
    if (typeof window !== 'undefined' && window.translationInProgress) {
      console.log("系统正在处理中，请等待操作完成后再尝试移除图片");
      toast({
        variant: "destructive",
        title: t('notifications.busy.title'),
        description: t('notifications.busy.text'),
      });
      return;
    }
    
    try {
      // 清除状态
      setUploadedImage(null);
      setProcessedImage(null);
      // 重置所有模式的处理结果
      setProcessedImages({
        wechat: null,
        xiaohongshu: null,
        '4k': null
      });
      setProcessedDimensions({
        wechat: { width: 0, height: 0 },
        xiaohongshu: { width: 0, height: 0 },
        '4k': { width: 0, height: 0 }
      });
      setProgress(0);
      setModeChanged(false);
      
      // 安全地重置文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('移除图片时出错:', error);
    }
  };

  // 图片压缩函数
  const compressImage = (imageDataUrl: string, maxWidth = 2048): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // 如果图片尺寸小于最大宽度，不必压缩
        if (img.width <= maxWidth) {
          resolve(imageDataUrl);
          return;
        }
        
        // 计算新的尺寸，保持宽高比
        const ratio = img.height / img.width;
        const newWidth = maxWidth;
        const newHeight = Math.round(newWidth * ratio);
        
        // 创建canvas进行压缩
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // 绘制调整后的图片
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          
          // 转换为dataURL格式，质量为0.88，保持较高质量
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          resolve(compressedDataUrl);
        } else {
          // 如果无法获取context，返回原图
          resolve(imageDataUrl);
        }
      };
      img.src = imageDataUrl;
    });
  };

  // 处理图片函数更新
  const processImage = async () => {
    if (!uploadedImage || isProcessing) return;
    
    // 检查系统是否正在处理中
    if (typeof window !== 'undefined' && window.translationInProgress) {
      console.log("系统正在处理中，请等待操作完成后再尝试处理图片");
      toast({
        variant: "destructive",
        title: t('notifications.busy.title'),
        description: t('notifications.busy.text'),
      });
      return;
    }

    setIsProcessing(true);
    setProgress(5);

    try {
      let imageToProcess = uploadedImage;
      
      setProgress(10);
      
      // 检查是否需要创建新的图像处理
      let createNew = false;
      if (!processedImages[mode]) {
        createNew = true;
      } else if (modeChanged) {
        createNew = true;
        setModeChanged(false);
      }
      
      if (createNew) {
        // 创建新的处理任务
        const img = new Image();
        img.onload = async () => {
          // 进度条逻辑改进
          let progressInterval: NodeJS.Timeout | undefined = undefined;
          const startProgress = () => {
            if (progressInterval) {
              clearInterval(progressInterval);
            }
            progressInterval = setInterval(() => {
              setProgress((prev) => {
                if (prev >= 90) {
                  clearInterval(progressInterval);
                  return 90;
                }
                return prev + (prev < 30 ? 1 : (prev < 60 ? 0.5 : 0.2));
              });
            }, 100);
          };
          
          // 开始进度
          startProgress();
          
          try {
            // 根据不同模式进行处理
            if (mode === '4k') {
              // 4K蓝光模式：调用API进行处理
              
              // 将图片转换为Blob
              const response = await fetch(imageToProcess);
              const blob = await response.blob();
              
              // 创建FormData对象
              const formData = new FormData();
              formData.append('image', blob, 'image.jpg');
              

              // 添加调试日志
              console.log('准备向API发送请求:', {
                url: '/api/enhance',
                blobSize: blob.size,
                currentHost: window.location.origin
              });
              
              // 设置请求超时
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 120000); // 2分钟超时
              
              try {
                // 发送请求到API - 使用相对路径
                const apiResponse = await fetch('/api/enhance', {
                  method: 'POST',
                  body: formData,
                  signal: controller.signal,
                  // 使用keep-alive提高连接效率
                  headers: {
                    'Connection': 'keep-alive',
                  }
                });
                
                clearTimeout(timeoutId);
                
                if (!apiResponse.ok) {
                  const errorText = await apiResponse.text();
                  console.error('API响应错误:', errorText);
                  throw new Error(`API返回错误: ${apiResponse.status}`);
                }
                
                const result = await apiResponse.json();
                
                if (result.success && result.imageUrl) {
                  // 设置处理后的图片
                  const finalImage = await fetch(result.imageUrl);
                  const finalImageBlob = await finalImage.blob();
                  const finalImageUrl = URL.createObjectURL(finalImageBlob);
                  
                  // 保存当前模式下的处理结果
                  setProcessedImages(prev => ({
                    ...prev,
                    [mode]: finalImageUrl
                  }));
                  
                  setProcessedImage(finalImageUrl);
                  setProgress(100);
                  setIsProcessing(false);
                  
                  // 获取处理后图片尺寸
                  const processedImg = new Image();
                  processedImg.onload = () => {
                    setProcessedDimensions(prev => ({
                      ...prev,
                      [mode]: { width: processedImg.width, height: processedImg.height }
                    }));
                  };
                  processedImg.src = finalImageUrl;
                  
                  // 显示成功提示
                  toast({
                    variant: "default",
                    title: t(`notifications.processing.success.${mode}` as const),
                    description: t('notifications.processing.successText'),
                  });
                } else {
                  throw new Error(result.error || '图片处理失败');
                }
              } catch (error) {
                clearTimeout(timeoutId);
                if (error.name === 'AbortError') {
                  throw new Error('请求超时，请尝试使用更小的图片或稍后再试');
                }
                throw error;
              }
            } else {
              // 计算目标尺寸，根据不同模式进行处理
              let targetWidth: number = 0;
              let targetHeight: number = 0;
              
              if (mode === 'wechat') {
                // 朋友圈模式：短边1080px，长边等比例缩放
                if (img.width < img.height) {
                  // 图片是竖向的，宽度是短边
                  targetWidth = 1080;
                  targetHeight = Math.round((img.height / img.width) * 1080);
                } else {
                  // 图片是横向的，高度是短边
                  targetHeight = 1080;
                  targetWidth = Math.round((img.width / img.height) * 1080);
                }
              } else if (mode === 'xiaohongshu') {
                // 小红书模式：3:4比例，尺寸为1280*1706像素
                targetWidth = 1280;
                targetHeight = 1706;
              }

              // 创建canvas来调整图片尺寸
              const canvas = document.createElement('canvas');
              canvas.width = targetWidth;
              canvas.height = targetHeight;
              const ctx = canvas.getContext('2d');
              
              if (ctx) {
                // 绘制调整后的图片（居中裁剪方式）
                if (mode === 'xiaohongshu') {
                  // 小红书模式下执行居中裁剪
                  // 先填充白色背景
                  ctx.fillStyle = '#ffffff';
                  ctx.fillRect(0, 0, targetWidth, targetHeight);
                  
                  // 计算如何以3:4比例裁剪和缩放图片
                  const targetRatio = 3 / 4; // 目标比例3:4
                  const imgRatio = img.width / img.height;
                  
                  let sw: number, sh: number, sx: number, sy: number, dw: number, dh: number, dx: number, dy: number;
                  
                  if (imgRatio > targetRatio) {
                    // 原图比例宽于3:4，需要裁掉两侧
                    sh = img.height;
                    sw = sh * targetRatio;
                    sx = (img.width - sw) / 2;
                    sy = 0;
                    dw = targetWidth;
                    dh = targetHeight;
                    dx = 0;
                    dy = 0;
                  } else {
                    // 原图比例窄于3:4，需要裁掉上下
                    sw = img.width;
                    sh = sw / targetRatio;
                    sx = 0;
                    sy = (img.height - sh) / 2;
                    dw = targetWidth;
                    dh = targetHeight;
                    dx = 0;
                    dy = 0;
                  }
                  
                  // 居中绘制图像，保持3:4比例
                  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
                } else {
                  // 朋友圈模式下执行等比例缩放
                  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                }
                
                // 将canvas内容转换为图片
                const processedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
                
                // 保存当前模式下的处理结果
                setProcessedImages(prev => ({
                  ...prev,
                  [mode]: processedDataUrl
                }));
                
                // 设置处理后的图片
                setProcessedImage(processedDataUrl);
                
                // 完成处理
                setProgress(100);
                setIsProcessing(false);
                
                // 获取处理后图片尺寸
                const processedImg = new Image();
                processedImg.onload = () => {
                  setProcessedDimensions(prev => ({
                    ...prev,
                    [mode]: { width: processedImg.width, height: processedImg.height }
                  }));
                };
                processedImg.src = processedDataUrl;
              } else {
                // 如果无法获取canvas上下文，回退到原图
                setProcessedImage(imageToProcess);
                setProgress(100);
                setIsProcessing(false);
                
                // 使用toast显示错误
                toast({
                  variant: "destructive",
                  title: t('notifications.processing.failure'),
                  description: t('notifications.processing.failureText'),
                });
              }
            }
          } catch (error) {
            console.error('处理图片时出错:', error);
            // 处理失败时回退到原图
            setProcessedImage(imageToProcess);
            setProgress(100);
            setIsProcessing(false);
            
            // 使用toast显示错误
            toast({
              variant: "destructive",
              title: t('notifications.processing.failure'),
              description: error instanceof Error ? error.message : t('notifications.processing.failureText'),
            });
          } finally {
            // 确保清除进度条计时器
            clearInterval(progressInterval);
          }
        };
        
        img.onerror = () => {
          // 加载图片失败
          setIsProcessing(false);
          setProgress(0);
        
          // 使用toast显示错误
          toast({
            variant: "destructive",
            title: t('notifications.processing.loadFailure'),
            description: t('notifications.processing.loadFailureText'),
          });
        };
        
        img.src = imageToProcess;
      } else {
        // 直接显示已有的处理结果
        setProcessedImage(processedImages[mode]);
        setProgress(100);
        setIsProcessing(false);
        
        // 显示成功提示
        toast({
          variant: "default",
          title: t(`notifications.processing.success.${mode}` as const),
          description: t('notifications.processing.successText'),
        });
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setProgress(0);
      setIsProcessing(false);
      
      toast({
        variant: "destructive",
        title: t('notifications.processing.failure'),
        description: t('notifications.processing.failureText'),
      });
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;
    
    // 如果正在翻译中，阻止下载
    if (typeof window !== 'undefined' && window.translationInProgress) {
      console.log("系统正在处理中，请稍等...");
      toast({
        variant: "destructive",
        title: t('notifications.busy.title'),
        description: t('notifications.busy.text'),
      });
      return;
    }
    
    try {
      // 使用URL.createObjectURL方法创建一个blob URL
      fetch(processedImage)
        .then(response => response.blob())
        .then(blob => {
          // 创建blob URL
          const blobUrl = URL.createObjectURL(blob);
          
          // 创建一个隐藏的a标签
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = blobUrl;
          a.download = mode === 'wechat' 
            ? `wechat_enhanced_${new Date().getTime()}.jpg` 
            : mode === 'xiaohongshu'
            ? `xiaohongshu_${new Date().getTime()}.jpg`
            : `4K_enhanced_${new Date().getTime()}.jpg`;
          
          // 模拟点击
          a.click();
          
          // 释放URL对象，因为已不需要，这是一个良好的实践
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
          }, 100);
          
          // 下载成功提示
          toast({
            title: t('notifications.download.success'),
            description: t('notifications.download.shareText'),
          });
        })
        .catch(err => {
          console.error('下载图片时出错:', err);
          toast({
            variant: "destructive",
            title: t('notifications.download.failure'),
            description: t('notifications.download.failureText'),
          });
        });
    } catch (err) {
      console.error('下载图片时出错:', err);
      toast({
        variant: "destructive",
        title: t('notifications.download.failure'),
        description: t('notifications.download.failureText'),
      });
    }
  };

  const CrystalLogo = () => (
    <div className="relative w-32 h-32 mb-12 floating-icon">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-28 h-28 bg-gradient-to-r from-[#4f46e5] via-[#ec4899] to-[#4f46e5] rounded-full opacity-50 animate-pulse" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 bg-gradient-to-r from-[#ec4899] via-[#4f46e5] to-[#ec4899] rounded-full opacity-30 animate-pulse delay-75" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 bg-gradient-to-r from-[#4f46e5] via-[#ec4899] to-[#4f46e5] rounded-full opacity-20 animate-pulse delay-150" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Wand2 className="w-14 h-14 text-white drop-shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
      </div>
    </div>
  );

  const testimonials = [
    {
      name: t('testimonials.users.user1'),
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8yZ-tixAWh88x5K25PoqBgkfEFQm-vWh-nA&s",
      comment: t('testimonials.comments.comment1'),
      rating: 5
    },
    {
      name: t('testimonials.users.user2'),
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCCRl9eKjcwK30bqLP25AJzr1vMYBwMBBDDQ&s",
      comment: t('testimonials.comments.comment2'),
      rating: 5
    },
    {
      name: t('testimonials.users.user3'),
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_AWxjVhXrye2Tg0VGJfu_JeyrI9ovkao28w&s",
      comment: t('testimonials.comments.comment3'),
      rating: 5
    }
  ];

  const faqs = [
    {
      question: t('faq.questions.q1'),
      answer: t('faq.answers.a1')
    },
    {
      question: t('faq.questions.q2'),
      answer: t('faq.answers.a2')
    },
    {
      question: t('faq.questions.q3'),
      answer: t('faq.answers.a3')
    },
    {
      question: t('faq.questions.q4'),
      answer: t('faq.answers.a4')
    },
    {
      question: t('faq.questions.q5'),
      answer: t('faq.answers.a5')
    }
  ];

  // 添加安全的模式切换函数
  const handleModeChange = (newMode: 'wechat' | 'xiaohongshu' | '4k') => {
    // 防止处理中切换
    if (isProcessing) return;
    
    // 检查系统是否正在处理中
    if (typeof window !== 'undefined' && window.translationInProgress) {
      console.log("系统正在处理中，请等待操作完成后再尝试");
      toast({
        variant: "destructive",
        title: t('notifications.busy.title'),
        description: t('notifications.busy.text'),
      });
      return;
    }
    
    try {
      // 保存当前模式的处理结果
      if (processedImage) {
        setProcessedImages(prev => ({
          ...prev,
          [mode]: processedImage
        }));
      }
      
      // 切换模式
      setMode(newMode);
      
      // 更新处理图片
      const processedModeImage = processedImages[newMode];
      setProcessedImage(processedModeImage);
      
      // 如果需要处理，提示用户
      if (!processedModeImage && uploadedImage) {
        setModeChanged(true);
        toast({
          title: t('modeSwitch.title'),
          description: t(`modeSwitch.to${newMode}`),
        });
      }
    } catch (error) {
      console.error('模式切换出错:', error);
    }
  };

  // 滚动到上传区域
  const scrollToUploadZone = () => {
    uploadZoneRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen hero-gradient text-white">
      <Toaster />
      <div className="mx-auto max-w-[1168px] px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <CrystalLogo />
          <h1 className="text-4xl md:text-5xl font-bold shine-text mb-2">
            {t('hero.title')}
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium text-[#ec4899] mb-6">
            {t('hero.subtitle')}
          </h2>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {[
              t('tags.imageEnhancer'), 
              t('tags.photoRepair'), 
              t('tags.aiUpscale'), 
              t('tags.codeformer'), 
              t('tags.contentCreator'), 
              t('tags.oneClick4k')
            ].map((tag, index) => (
              <span 
                key={index} 
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#4f46e5]/30 to-[#ec4899]/30 text-sm font-medium text-white backdrop-blur-md border border-white/20 hover:border-white/40 hover:from-[#4f46e5]/40 hover:to-[#ec4899]/40 transition-all shadow-sm hover:shadow-[0_0_10px_rgba(236,72,153,0.3)] transform hover:scale-105 duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed mb-8">
            {t('hero.description')}
          </p>
          <div className="mt-4">
            <Button 
              className="button-primary rounded-full px-8 py-6 text-lg"
              onClick={scrollToUploadZone}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {t('hero.freeUse')}
            </Button>
          </div>
        </div>

        {/* AI 增强设置 - 水平版 */}
        <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl max-w-4xl mx-auto mb-12">
          <h3 className="text-xl font-semibold mb-4 shine-text text-center">
            {t('settings.title')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-3">
              <div className="flex items-center gap-4 flex-wrap justify-center mb-6">
                <button 
                  className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    mode === '4k' 
                      ? 'bg-[#4f46e5] text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                  data-mode="4k"
                  onClick={() => handleModeChange('4k')}
                >
                  {mode === '4k' ? (
                    <Sparkles className="w-5 h-5" />
                  ) : (
                    <ZapIcon className="w-5 h-5" />
                  )}
                  <span>{t('settings.4kMode')}</span>
                </button>
                
                <button 
                  className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    mode === 'wechat' 
                      ? 'bg-[#4f46e5] text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                  data-mode="wechat"
                  onClick={() => handleModeChange('wechat')}
                >
                  {mode === 'wechat' ? (
                    <MessageCircle className="w-5 h-5" />
                  ) : (
                    <MessageCircle className="w-5 h-5" />
                  )}
                  <span>{t('settings.wechatMode')}</span>
                </button>
                
                <button 
                  className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    mode === 'xiaohongshu' 
                      ? 'bg-[#4f46e5] text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                  data-mode="xiaohongshu"
                  onClick={() => handleModeChange('xiaohongshu')}
                >
                  <div className="w-5 h-5 relative flex items-center justify-center">
                    {mode === 'xiaohongshu' ? (
                      <BookOpen className="w-5 h-5" />
                    ) : (
                      <BookOpen className="w-5 h-5" />
                    )}
                  </div>
                  <span>{t('settings.xiaohongshuMode')}</span>
                </button>
              </div>
            </div>
            
            <div className="md:col-span-2 border-r border-white/10 pr-4">
              <p className="text-sm text-gray-300 max-w-2xl">
                {mode === 'wechat'
                  ? t('settings.wechatDescription')
                  : mode === 'xiaohongshu'
                  ? t('settings.xiaohongshuDescription')
                  : t('settings.4kDescription')}
              </p>
            </div>
            
            <div className="md:col-span-1">
              <div className="flex flex-col gap-3">
                <div className="mb-2">
                  <label className="text-xs text-gray-300 mb-1 block">
                    {t('settings.progress')}
                  </label>
                  <Progress value={progress} className="w-full h-2 rounded-full progress-bar">
                    <div 
                      className="h-full progress-fill rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }} 
                    />
                  </Progress>
                  {progress > 0 && (
                    <p className="text-right text-xs text-gray-400 mt-1">{Math.round(progress)}%</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className={`flex-1 py-1 px-2 text-sm button-primary rounded-lg ${(!uploadedImage || isProcessing) ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={!uploadedImage || isProcessing}
                    onClick={processImage}
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    {isProcessing ? t('settings.processing') : t('settings.process')}
                  </Button>
                  
                  <Button 
                    className={`flex-1 py-1 px-2 text-sm bg-white/10 hover:bg-white/20 text-white border-0 rounded-lg ${!processedImage ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={!processedImage}
                    onClick={downloadImage}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    {t('settings.download')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-24">
          <Card className="p-4 md:p-8 hero-card mx-auto max-w-full md:w-[1000px]">
            <div 
              className={`upload-zone rounded-xl p-3 md:p-6 flex flex-col items-center justify-center h-[400px] md:h-[700px] relative group ${
                isDragging ? 'dragging' : ''
              }`}
              onDragEnter={handleDragOver}
              onDragOver={handleDragOver}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              ref={uploadZoneRef}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                style={{ display: uploadedImage ? 'none' : 'block' }}
              />
              
              {uploadedImage ? (
                <div className="w-full h-full flex flex-col items-center justify-center relative">
                  <div className="absolute top-2 right-2 z-20">
                    <button
                      className="bg-black/50 hover:bg-black/70 rounded-full p-1 transition-colors"
                      onClick={removeUploadedImage}
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  
                  {/* 分屏对比显示 - 仅在4K模式且有处理后图片时显示 */}
                  {mode === '4k' && processedImage ? (
                    <div className="relative w-full h-[300px] md:h-[650px] overflow-hidden rounded-lg mb-4" ref={imageContainerRef}>
                      {/* 全屏按钮 */}
                      <div className="absolute bottom-2 right-2 z-20 hidden md:block">
                        <button
                          className="bg-black/50 hover:bg-black/70 rounded-full p-1.5 transition-colors"
                          onClick={toggleFullscreen}
                        >
                          <MaximizeIcon className="w-5 h-5 text-white" />
                        </button>
                      </div>
                      
                      <div className="flex h-full relative">
                        <div className="w-1/2 relative border-r border-white/30">
                          <div className="absolute top-2 left-2 z-10 bg-white/80 text-gray-900 text-xs font-medium px-2 py-1 rounded-full">
                            {t('processing.original')}
                          </div>
                          <div className="absolute top-2 right-2 z-10 bg-white/30 text-white text-xs font-medium px-2 py-1 rounded-full hidden md:block">
                            {imageDimensions.width > 0 && `${Math.round(imageDimensions.width)} × ${Math.round(imageDimensions.height)} px`}
                          </div>
                          <img 
                            src={uploadedImage} 
                            alt="原始图片"
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 pointer-events-none border-r-0 border border-white/10"></div>
                        </div>
                        <div className="w-1/2 relative">
                          <div className="absolute top-2 left-2 z-10 bg-[#34d399]/80 text-white text-xs font-medium px-2 py-1 rounded-full">
                            {t('processing.enhanced.4k')}
                          </div>
                          <div className="absolute top-2 right-2 z-10 bg-white/30 text-white text-xs font-medium px-2 py-1 rounded-full hidden md:block">
                            {processedDimensions['4k'].width > 0 ? 
                              `${Math.round(processedDimensions['4k'].width)} × ${Math.round(processedDimensions['4k'].height)} px` : 
                              '4K超清分辨率'}
                          </div>
                          <img 
                            src={processedImage} 
                            alt="4K处理后的图片"
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 pointer-events-none border-l-0 border border-white/10"></div>
                        </div>
                        
                        {/* 中央分隔线 */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#34d399]/70 transform -translate-x-1/2 z-10">
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#34d399] flex items-center justify-center shadow-lg">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 22V2M2 12H22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                    </div>
                  ) : (
                    <div className="relative w-full h-[300px] md:h-[650px] overflow-hidden rounded-lg mb-4" ref={imageContainerRef}>
                      <img 
                        src={processedImage || uploadedImage} 
                        alt={processedImage ? "处理后的图片" : "上传的图片"}
                        className="w-full h-full object-contain"
                      />
                      {processedImage && (
                        <div className={`absolute top-2 left-2 ${mode === 'wechat' ? 'bg-green-500/80' : mode === 'xiaohongshu' ? 'bg-[#ff2e51]/80' : 'bg-[#34d399]/80'} text-white text-xs font-medium px-2 py-1 rounded-full`}>
                          {mode === 'wechat' ? t('processing.enhanced.wechat') : mode === 'xiaohongshu' ? t('processing.enhanced.xiaohongshu') : t('processing.enhanced.bluray')}
                        </div>
                      )}
                      {mode === 'xiaohongshu' && processedImage && (
                        <div className="absolute bottom-2 right-2 bg-black/50 rounded-md p-1">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                      )}
                      
                      {/* 全屏按钮 */}
                      <div className="absolute bottom-2 right-2 z-20 hidden md:block">
                        <button
                          className="bg-black/50 hover:bg-black/70 rounded-full p-1.5 transition-colors"
                          onClick={toggleFullscreen}
                        >
                          <MaximizeIcon className="w-5 h-5 text-white" />
                        </button>
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  )}
                  
                  {processedImage ? (
                    <p className="text-white text-sm">
                      {mode === 'wechat'
                        ? t('processing.complete.wechat')
                        : mode === 'xiaohongshu'
                        ? t('processing.complete.xiaohongshu')
                        : t('processing.complete.4k')}
                    </p>
                  ) : (
                    <div className="flex flex-col md:flex-row items-center justify-center mt-2 gap-3">
                      <button
                        onClick={processImage}
                        disabled={isProcessing}
                        className="bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium rounded-full px-5 py-2 flex items-center gap-2 shadow-lg shadow-[#4f46e5]/30 transition-all"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>{t('settings.processing')}</span>
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4" />
                            <span>{t('processing.startProcess')}</span>
                          </>
                        )}
                      </button>
                      
                      {modeChanged && (
                        <p className="text-white/70 text-sm">
                          {t(`modeSwitch.to${mode}`)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#4f46e5] rounded-full blur-2xl opacity-20 animate-pulse" />
                    <ImagePlus 
                      className={`w-10 h-10 md:w-16 md:h-16 mb-4 md:mb-6 transition-all duration-300 ${
                        isDragging ? 'text-[#ec4899] scale-110' : 'text-gray-400'
                      }`} 
                    />
                  </div>
                  <p className={`text-lg md:text-xl font-medium transition-all duration-300 ${
                    isDragging ? 'text-[#ec4899]' : 'text-gray-300'
                  }`}>
                    {t('upload.dragOrClick')}
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 mt-2 md:mt-3">{t('upload.supportedFormats')}</p>
                  <p className="text-xs md:text-sm text-gray-400 mt-1">
                    {t('upload.sizeLimit') || "最大文件大小: 50MB"}
                  </p>
                  {mode === 'xiaohongshu' && (
                    <div className="mt-3 md:mt-4 flex items-center bg-[#ff2e51]/10 rounded-full px-2 md:px-3 py-1">
                      <img src="https://pic1.imgdb.cn/item/67dcfbaf88c538a9b5c294b3.png" alt="小红书" className="w-4 h-4 mr-1 md:mr-2" />
                      <span className="text-[10px] md:text-xs text-[#ff2e51]">{t('upload.xiaohongshuEnabled')}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Case Study Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-10 shine-text">{t('caseStudy.title')}</h2>
          <div className="mx-auto max-w-xl rounded-xl overflow-hidden shadow-[0_0_30px_rgba(236,72,153,0.2)]">
            <img 
              src="https://tuchuang.org.cn/imgs/2025/03/22/89879711d95bbc5d.jpg" 
              alt="朋友圈图片优化案例" 
              className="w-full object-cover"
            />
            <div className="p-4 bg-gradient-to-r from-[#4f46e5]/20 to-[#ec4899]/20 backdrop-blur-md">
              <p className="text-center text-white text-sm md:text-base">{t('caseStudy.caption')}</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12 shine-text">{t('features.title')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: t('features.aiEnhancement.title'),
                description: t('features.aiEnhancement.description'),
                icon: Wand2,
              },
              {
                title: t('features.multiPlatform.title'),
                description: t('features.multiPlatform.description'),
                icon: ImagePlus,
              },
              {
                title: t('features.faceRetouching.title'),
                description: t('features.faceRetouching.description'),
                icon: Share2,
              },
            ].map((feature, index) => (
              <Card 
                key={index} 
                className="p-6 feature-card"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-[#4f46e5] rounded-full blur-xl opacity-20" />
                  <feature.icon className="w-10 h-10 text-[#ec4899] relative z-10" />
                </div>
                <h3 className="text-xl font-semibold mb-3 shine-text">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12 shine-text">{t('testimonials.title')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hero-card p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-medium text-white">{testimonial.name}</h4>
                    <div className="flex">
                      {Array(testimonial.rating).fill(0).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300">{testimonial.comment}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12 shine-text">{t('faq.title')}</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card 
                key={index} 
                className="faq-card p-6 cursor-pointer"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">{faq.question}</h3>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
                {openFaq === index && (
                  <p className="mt-4 text-gray-300">{faq.answer}</p>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-4 mb-8">
            <CheckCircle2 className="w-6 h-6 text-[#ec4899]" />
            <span className="text-gray-300">{t('cta.users')}</span>
          </div>
          <Button 
            className="button-primary rounded-full px-8 py-6 text-lg"
            onClick={scrollToUploadZone}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            {t('cta.tryNow')}
          </Button>
        </div>
      </div>
    </main>
  );
}                                             