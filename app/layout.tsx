import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import Script from 'next/script';
import { metadata as pageMetadata } from './page-metadata';
import LanguageSwitcher from './components/LanguageSwitcher';
import TranslatorScript from './components/TranslatorScript';

const inter = Inter({ subsets: ['latin'] });

// 合并基本元数据和特定页面元数据
export const metadata: Metadata = {
  ...pageMetadata,
  metadataBase: new URL('https://photochatpro.vercel.app'),
  authors: [{ name: 'Photo Chat Pro Team' }],
  robots: 'index, follow',
  alternates: {
    canonical: 'https://photochatpro.vercel.app',
  },
  openGraph: {
    title: 'AI 图片增强工具 | 照片超清处理',
    description: '专业的AI图片增强工具，一键修复微信压缩失真，使用CodeFormer技术让您的照片展现完美画质。支持多种社交平台，免费使用。',
    url: 'https://photochatpro.vercel.app',
    siteName: 'Photo Chat Pro',
    images: [
      {
        url: 'https://tuchuang.org.cn/imgs/2025/03/22/89879711d95bbc5d.jpg',
        width: 1200,
        height: 630,
        alt: 'AI图片增强工具展示',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 图片增强工具 | 照片超清处理',
    description: '专业的AI图片增强工具，使用CodeFormer技术提升照片质量，支持微信、小红书等平台图片优化',
    images: ['https://tuchuang.org.cn/imgs/2025/03/22/89879711d95bbc5d.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-CTFFK2YZY9" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CTFFK2YZY9');
          `}
        </Script>
        <meta name="baidu-site-verification" content="codeva-ruHWtJSvnS" />
        <meta name="msvalidate.01" content="D27559B64E907A337CB7F3C0CF655EDB" />
        <meta name="bytedance-verification-code" content="CklYgsH5W4ONWXFxGBO3" />
        
        {/* 添加翻译器CSS */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* 确保FAQ文本在英文模式下是白色 */
          [data-original-text] {
            color: white !important;
          }
          
          .faq-card h3 {
            color: white !important;
          }
          
          .faq-card p {
            color: rgb(209, 213, 219) !important;
          }
        `}} />
        
        {/* 翻译器脚本 - 直接在全局范围内执行 */}
        <Script id="translator-script" strategy="afterInteractive">
          {`
            // 创建翻译数据
            window.translationDict = {
              // 首页内容
              "AI 图片增强工具 | 照片超清处理": "AI Image Enhancement Tool | Photo HD Processing",
              "专业的AI图片(Photo Enhancer Pro)增强工具，一键修复微信压缩失真，提升照片清晰度，让您的朋友圈照片展现完美画质": "Professional AI image enhancement tool (Photo Enhancer Pro), one-click fixing of WeChat compression distortion, improving photo clarity, and displaying perfect image quality for your social media photos",
              "免费，无限制使用": "Free, Unlimited Use",
              "图片增强工具": "Image Enhancement Tool",
              "照片修复": "Photo Repair",
              "AI图像超分": "AI Image Upscaling",
              "CodeFormer模型": "CodeFormer Model",
              "自媒体神器": "Content Creator Tool",
              "一键4K增强": "One-click 4K Enhancement",
              
              // 功能部分
              "主要功能": "Key Features",
              "AI 智能图像增强": "AI Smart Image Enhancement",
              "多平台图片优化": "Multi-platform Image Optimization",
              "人脸智能修复": "Intelligent Face Restoration",
              "使用CodeFormer AI技术自动识别场景，优化细节和色彩，修复模糊和噪点，让照片更加清晰锐利": "Using CodeFormer AI technology to automatically recognize scenes, optimize details and colors, fix blur and noise, making photos clearer and sharper",
              "支持朋友圈超清图片、小红书高清封面和4K蓝光增强，满足各类社交媒体的图片需求": "Supports WeChat Moments HD images, Red note high-definition covers, and 4K Blu-ray enhancement, meeting the image needs of various social media platforms",
              "CodeFormer AI模型能精准识别人脸细节，修复失真和模糊，让人像更加自然清晰": "CodeFormer AI model can accurately identify facial details, fix distortion and blur, making portraits more natural and clear",
              
              // 使用案例部分
              "使用案例": "Case Study",
              "超清处理效果展示 - 告别压缩失真，呈现原始画质": "HD processing effect display - Say goodbye to compression distortion, presenting original image quality",
              
              // FAQ部分
              "常见问题": "FAQ",
              "如何使用这个工具？": "How to use this tool?",
              "支持哪些图片格式？": "What image formats are supported?",
              "处理后的图片会占用更多空间吗？": "Will processed images take up more space?",
              "小红书封面和朋友圈图片有什么区别？": "What's the difference between Red note cover and WeChat Moments images?",
              "什么是4K蓝光增强？": "What is 4K Blu-ray enhancement?",
              "只需将您的图片拖入上传区域或点击选择文件，选择需要的格式（朋友圈、小红书或4K蓝光），点击开始处理即可。处理完成后可以下载或直接分享。": "Simply drag your image into the upload area or click to select a file, choose the required format (WeChat Moments, Red note, or 4K Blu-ray), and click to start processing. After processing, you can download or share directly.",
              "目前支持主流图片格式，包括JPG、PNG、WEBP等。建议上传原图以获得最佳效果。": "Currently supports mainstream image formats, including JPG, PNG, WEBP, etc. It is recommended to upload the original image for the best results.",
              "不会，我们采用智能压缩技术，在提升画质的同时保持合理的文件大小。": "No, we use intelligent compression technology to maintain a reasonable file size while improving image quality.",
              "小红书封面会按照平台推荐的3:4比例进行优化处理再进行像素ai增强，而朋友圈图片则保持短边1080px的高清标准。": "Red note covers are optimized according to the platform's recommended 3:4 ratio and then enhanced with pixel AI, while WeChat Moments images maintain the HD standard with a short edge of 1080px.",
              "我们使用CodeFormer AI模型在线处理，能够智能提升图片分辨率至4K级别，同时增强细节和色彩，修复人脸和背景，使照片更加清晰锐利，呈现出蓝光级别的高清画质。此服务完全免费。": "We use the CodeFormer AI model for online processing, which can intelligently increase image resolution to 4K level, enhance details and colors, repair faces and backgrounds, making photos clearer and sharper, presenting Blu-ray level high-definition image quality. This service is completely free.",
              
              // 底部CTA
              "已有超过 3000+ 用户选择使用": "Over 3,000+ users have chosen to use",
              "立即体验": "Try Now",
              
              // 页脚
              "隐私政策": "Privacy Policy",
              "服务条款": "Terms of Service",
              "博客": "Blog",
              "© 2025 • socialphotos.site 保留所有权利。": "© 2025 • socialphotos.site All Rights Reserved.",
              "保留所有权利": "All Rights Reserved",
              "© 2025": "© 2025",
              
              // 博客页面
              "图片增强技术博客": "Image Enhancement Technology Blog",
              "探索CodeFormer AI技术的前沿应用，了解如何使用AI工具提升照片质量": "Explore cutting-edge applications of CodeFormer AI technology and learn how to use AI tools to improve photo quality",
              "返回主页": "Back to Home",
              "搜索文章": "Search Articles",
              "标签": "Tags",
              "全部": "All",
              "最新文章": "Latest Articles",
              "阅读更多": "Read More",
              "发布日期": "Publication Date",
              
              // 404页面
              "404 - 页面未找到": "404 - Page Not Found",
              "很抱歉，您访问的页面不存在": "Sorry, the page you are looking for does not exist",
              "返回首页": "Return to Home",
              
              // 博客文章相关
              "返回博客列表": "Back to Blog List",
              "返回博客": "Back to Blog",
              "朋友圈发布高清照片完全指南：不再被压缩的秘诀": "Complete Guide to Publishing HD Photos on WeChat Moments: Secrets to Avoid Compression",
              "小红书高清主页打造攻略：脱颖而出的视觉密码": "Red note HD Profile Creation Strategy: The Visual Code to Stand Out",
              "2024年最佳微信朋友圈高清图片工具对比分析": "Comparative Analysis of the Best WeChat Moments HD Image Tools in 2024",
              "揭秘微信朋友圈图片压缩机制及应对策略": "Revealing WeChat Moments Image Compression Mechanism and Coping Strategies",
              "微信朋友圈, 高清照片, 实用技巧": "WeChat Moments, HD Photos, Practical Tips",
              "小红书, 主页优化, 图片处理": "Red note, Profile Optimization, Image Processing",
              
              // 工具使用相关
              "拖放图片到这里或点击上传": "Drop images here or click to upload",
              "支持的格式": "Supported formats",
              "最大": "Max",
              "选择增强模式": "Select Enhancement Mode",
              "朋友圈高清图": "WeChat Moments HD",
              "小红书封面图": "Red note Cover",
              "4K蓝光增强": "4K Blu-ray Enhancement",
              "开始处理": "Start Processing",
              "正在处理中": "Processing",
              "下载": "Download",
              "重新上传": "Upload Again",
              "处理完成！": "Processing Complete!",
              "效果预览": "Effect Preview",
              "原图": "Original",
              "增强版": "Enhanced",
              
              // AI增强设置区域
              "AI 增强设置": "AI Enhancement Settings",
              "图片一键4k质量": "One-click 4K Quality",
              "朋友圈超清": "WeChat Moments HD",
              "小红书封面": "Red note Cover",
              "朋友圈模式：短边1080px，长边等比例缩放，确保图片在朋友圈显示清晰不被压缩": "WeChat Moments mode: 1080px short edge, proportional scaling for long edge, ensuring clear display without compression",
              "小红书模式：3:4比例，1280*1706像素，确保在小红书上获得最佳展示效果不被压缩": "Red note mode: 3:4 ratio, 1280*1706 pixels, ensuring optimal display without compression",
              "4K蓝光模式：提升至4K级别，应用蓝光级别的细节和色彩增强（在线处理，根据您的网速，大约需要10-30秒）": "4K Blu-ray mode: Enhances to 4K level, applies Blu-ray quality detail and color enhancement (online processing, takes about 10-30 seconds depending on your internet speed)",
              "处理进度": "Processing Progress",
              "处理": "Process",
              "处理中": "Processing",
              "模式已切换": "Mode Switched",
              "已切换至4K蓝光模式，请点击处理按钮": "Switched to 4K Blu-ray mode, please click the Process button",
              "已切换至朋友圈超清模式，请点击处理按钮": "Switched to WeChat Moments HD mode, please click the Process button",
              "已切换至小红书封面模式，请点击处理按钮": "Switched to Red note Cover mode, please click the Process button",
              "拖入图片或点击上传": "Drag image here or click to upload",
              "支持 JPG、PNG 等图片格式": "Supports JPG, PNG and other image formats",
              "小红书最佳封面模式已开启": "Red note best cover mode enabled",
              "处理完成，可以下载或分享到朋友圈": "Processing complete, ready to download or share to WeChat Moments",
              "处理完成，可以下载或上传到小红书": "Processing complete, ready to download or upload to Red note",
              "处理完成，可以下载您的4K蓝光增强图": "Processing complete, ready to download your 4K Blu-ray enhanced image",
              "模式已切换为朋友圈超清，点击处理按钮重新优化": "Mode switched to WeChat Moments HD, click Process button to optimize again",
              "模式已切换为小红书封面，点击处理按钮重新优化": "Mode switched to Red note Cover, click Process button to optimize again",
              "模式已切换为4K蓝光增强，点击处理按钮重新优化": "Mode switched to 4K Blu-ray enhancement, click Process button to optimize again",
              "已上传图片，点击处理按钮开始优化": "Image uploaded, click Process button to start optimization",
              "原图": "Original",
              "4K增强": "4K Enhanced",
              "朋友圈已优化": "WeChat Moments Optimized",
              "小红书已优化": "Red note Optimized",
              "4K蓝光已增强": "4K Blu-ray Enhanced",
              
              // 用户评价部分
              "用户评价": "User Reviews",
              "照片质量提升很明显，朋友圈照片终于不会被压得模糊了！": "Photo quality improvement is very noticeable, WeChat Moments photos finally won't be compressed and blurry!",
              "界面简单易用，效果非常专业，推荐给需要的朋友。": "Simple and easy-to-use interface with professional results, recommended to friends who need it.",
              "一键处理，方便快捷，照片清晰度提升很多！": "One-click processing, convenient and quick, photo clarity improved significantly!",
              "Yuxiii": "Yuxiii",
              "小巷子": "Xiaoxiangzi",
              "喜欢蛋糕": "Cake Lover",
              "图片下载成功": "Image downloaded successfully",
              "您可以立即分享到社交平台。": "You can share it to social platforms immediately.",
              
              // 补充额外常用元素和按钮文本
              "点击切换语言 / Click to switch language": "Click to switch language / 点击切换语言",
              "切换中...": "Switching...",
              "点击切换语言": "Click to switch language",
              "🇺🇸 English": "🇺🇸 English",
              "🇨🇳 中文": "🇨🇳 Chinese",
              "Language Switch": "Language Switch",
              "切换语言": "Switch Language",
              
              // 上传后状态提示
              "已上传图片，点击处理按钮开始优化": "Image uploaded, click Process button to start optimization",
              "处理完成，可以下载您的4K蓝光增强图": "Processing complete, ready to download your 4K Blu-ray enhanced image",
              "处理完成，可以下载或分享到朋友圈": "Processing complete, ready to download or share to WeChat Moments",
              "处理完成，可以下载或上传到小红书": "Processing complete, ready to download or upload to Red note",
              "处理完成，可以下载": "Processing complete, ready to download",
              "小红书最佳封面模式已开启": "Red note best cover mode enabled",
              "朋友圈已优化": "WeChat Moments Optimized",
              "小红书已优化": "Red note Optimized", 
              "4K蓝光已增强": "4K Blu-ray Enhanced",
              "模式已切换为朋友圈超清，点击处理按钮重新优化": "Mode switched to WeChat Moments HD, click Process button to optimize again",
              "模式已切换为小红书封面，点击处理按钮重新优化": "Mode switched to Red note Cover, click Process button to optimize again",
              "模式已切换为4K蓝光增强，点击处理按钮重新优化": "Mode switched to 4K Blu-ray enhancement, click Process button to optimize again",
              "图片加载失败": "Image loading failed",
              "无法加载图片，请检查图片格式是否支持或尝试其他图片。": "Failed to load image. Please check if the image format is supported or try another image.",
              "处理图片失败": "Image processing failed",
              "图片处理过程中遇到错误，已恢复为原图。请尝试其他图片或稍后重试。": "Error occurred during image processing. Reverted to original image. Please try another image or try again later.",
              
              // 图片相关标签和状态
              "原始图片": "Original Image",
              "处理后的图片": "Processed Image",
              "上传的图片": "Uploaded Image",
              "4K蓝光": "4K Blu-ray",
              "朋友圈": "WeChat Moments",
              "小红书": "Red note",
              "朋友圈图片优化案例": "WeChat Moments Image Optimization Example",
              "拖入图片或点击上传": "Drag image here or click to upload",
              "支持 JPG、PNG 等图片格式": "Supports JPG, PNG and other image formats",
              "Image uploaded, click Process button to start optimization": "Image uploaded, click Process button to start optimization",
              
              // 按钮文本
              "免费，无限制使用": "Free, Unlimited Use",
              "处理": "Process",
              "下载": "Download"
            };
            
            // 保存页面状态
            window.siteLanguage = 'zh';  // 默认中文
            window.originalTexts = new Map();  // 存储原始文本

            // JavaScript方式定义window属性，不使用TypeScript接口
            
            // 设置语言函数，供React组件调用
            window.setLanguage = function(lang) {
              if (lang === 'en' && window.siteLanguage !== 'en') {
                window.translate(); // 切换到英文
                window.saveLanguagePreference('en');
              } else if (lang === 'zh' && window.siteLanguage !== 'zh') {
                window.translate(); // 切换到中文
                window.saveLanguagePreference('zh');
              }
            };
            
            // 检测浏览器语言并自动设置语言
            window.detectBrowserLanguage = function() {
              try {
                // 获取浏览器语言
                const browserLang = navigator.language || navigator.userLanguage;
                console.log("检测到浏览器语言:", browserLang);
                
                // 如果已经有语言偏好存储在localStorage中，优先使用它
                const savedLang = localStorage.getItem('preferred-language');
                if (savedLang) {
                  console.log("使用已保存的语言偏好:", savedLang);
                  window.siteLanguage = savedLang;
                  return savedLang;
                }
                
                // 根据浏览器语言设置默认语言
                // 如果浏览器语言以en开头，设置为英文；否则默认中文
                if (browserLang && browserLang.toLowerCase().startsWith('en')) {
                  console.log("设置默认语言为英文");
                  window.siteLanguage = 'en';
                  // 立即应用英文翻译
                  setTimeout(() => {
                    window.translate();
                  }, 300); // 给页面一点时间加载
                  return 'en';
                }
                
                return 'zh'; // 默认中文
              } catch (error) {
                console.error("检测浏览器语言出错:", error);
                return 'zh'; // 出错时默认使用中文
              }
            };
            
            // 保存用户语言偏好
            window.saveLanguagePreference = function(lang) {
              try {
                localStorage.setItem('preferred-language', lang);
                console.log("语言偏好已保存:", lang);
              } catch (error) {
                console.error("保存语言偏好出错:", error);
              }
            };
            
            // 添加翻译函数到window对象 - 完全重构版本，更加安全
            window.translate = function() {
              try {
                const isCurrentlyEnglish = window.siteLanguage === 'en';
                
                // 使用Promise和requestAnimationFrame优化性能，避免阻塞UI
                return new Promise(resolve => {
                  requestAnimationFrame(() => {
                    try {
                      if (isCurrentlyEnglish) {
                        // 从英文切换到中文
                        document.querySelectorAll('[data-original-text]').forEach(el => {
                          try {
                            if (el && el.parentNode) { // 确保元素仍在DOM中
                              // 安全地恢复原始文本
                              const originalText = el.getAttribute('data-original-text');
                              if (originalText) {
                                // 恢复原文本
                                el.textContent = originalText;
                                // 移除标记
                                el.removeAttribute('data-original-text');
                              }
                            }
                          } catch (elemError) {
                            console.log('跳过元素处理:', elemError);
                          }
                        });
                        window.siteLanguage = 'zh';
                      } else {
                        // 从中文切换到英文
                        // 扩展选择器以包含按钮内的文本，但排除特定类型的按钮
                        const elementsToTranslate = Array.from(document.querySelectorAll(
                          'h1, h2, h3, h4, h5, h6, p, span, a, li, div.text-sm, div.text-lg, footer, div.flex, label, button span, button div'
                        )).filter(el => 
                          el && 
                          el.textContent && 
                          !el.hasAttribute('data-original-text') &&
                          el.parentNode && // 确保元素仍在DOM中
                          // 排除图片容器和图片元素
                          !el.closest('.upload-zone img') &&
                          !el.matches('img') && 
                          !el.querySelector('img') &&
                          // 如果元素是div且只包含图片，则跳过
                          !(el.tagName.toLowerCase() === 'div' && 
                            el.querySelector('img') && 
                            el.childNodes.length <= 3)
                        );
                        
                        // 分批处理元素以避免长时间阻塞UI线程
                        const batchSize = 50;
                        const processBatch = (startIndex) => {
                          const endIndex = Math.min(startIndex + batchSize, elementsToTranslate.length);
                          const currentBatch = elementsToTranslate.slice(startIndex, endIndex);
                          
                          currentBatch.forEach(el => {
                            try {
                              const text = el.textContent.trim();
                              if (!text) return;
                              
                              // 直接查找翻译
                              let translation = window.translationDict[text];
                              
                              // 特殊处理页脚版权信息
                              if (!translation) {
                                if (text.includes('socialphotos.site')) {
                                  const footerPattern = /© \d{4}.* 保留所有权利/;
                                  if (footerPattern.test(text)) {
                                    translation = text.replace('保留所有权利', 'All Rights Reserved');
                                  }
                                } else if (/© \d{4}/.test(text)) {
                                  // 处理其他版权文本
                                  for (const [key, value] of Object.entries(window.translationDict)) {
                                    if (text.includes(key) && key.length > 5) {
                                      translation = text.replace(key, value);
                                      break;
                                    }
                                  }
                                }
                              }
                              
                              // 应用翻译，现在允许翻译按钮内容
                              if (translation && el.parentNode) { // 再次检查元素是否仍在DOM中
                                // 跳过包含图片的元素
                                if (el.querySelector('img') || el.matches('img')) {
                                  return;
                                }
                                
                                // 检查是否是图片容器
                                if (el.classList && 
                                    (el.classList.contains('upload-zone') || 
                                     el.closest('.upload-zone') || 
                                     el.closest('[ref=imageContainerRef]'))) {
                                  // 对于包含图片的容器，只翻译特定的状态文本，不改变整个容器
                                  return;
                                }
                                
                                el.setAttribute('data-original-text', text);
                                
                                // 翻译元素内容，包括按钮
                                el.textContent = translation;
                              }
                            } catch (elemError) {
                              console.log('跳过元素翻译:', elemError);
                            }
                          });
                          
                          // 如果还有剩余元素，调度下一批处理
                          if (endIndex < elementsToTranslate.length) {
                            setTimeout(() => processBatch(endIndex), 0);
                          } else {
                            // 所有批次处理完成
                            window.siteLanguage = 'en';
                            
                            // 保存语言偏好
                            try {
                              localStorage.setItem('preferred-language', 'en');
                            } catch (storageError) {
                              console.warn('无法保存语言偏好:', storageError);
                            }
                            
                            resolve(true);
                          }
                        };
                        
                        // 开始处理第一批
                        processBatch(0);
                        return; // 批处理会异步完成，通过Promise通知
                      }
                      
                      // 中文模式处理完成，保存偏好并恢复按钮
                      try {
                        localStorage.setItem('preferred-language', 'zh');
                      } catch (storageError) {
                        console.warn('无法保存语言偏好:', storageError);
                      }
                      
                      resolve(true);
                    } catch (mainError) {
                      console.error('翻译过程主错误:', mainError);
                      resolve(false);
                    }
                  });
                }).catch(error => {
                  console.error('翻译Promise错误:', error);
                  return false;
                });
              } catch (error) {
                console.error('翻译函数外层错误:', error);
                return false;
              }
            };
            
            // 设置DOM变化监听器，确保动态添加的内容也被翻译
            window.addEventListener('DOMContentLoaded', function() {
              console.log('设置内容变化监听器');
              
              // 如果已有监听器，先清除
              if (window.translationObserver) {
                window.translationObserver.disconnect();
              }
              
              // 创建新的监听器
              const observer = new MutationObserver(function(mutations) {
                // 如果当前是中文状态，无需翻译
                if (window.siteLanguage !== 'en') return;
                
                // 使用requestAnimationFrame优化性能
                requestAnimationFrame(function() {
                  try {
                    // 提取所有新添加的节点
                    const addedNodes = [];
                    mutations.forEach(function(mutation) {
                      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(function(node) {
                          if (node.nodeType === 1) { // 元素节点
                            addedNodes.push(node);
                          }
                        });
                      }
                    });
                    
                    // 如果没有新增节点，直接返回
                    if (addedNodes.length === 0) return;
                    
                    // 处理每个新节点
                    addedNodes.forEach(function(node) {
                      // 翻译节点自身
                      if (node.textContent && 
                          !node.hasAttribute('data-original-text') &&
                          node.parentNode) {
                        translateNode(node);
                      }
                      
                      // 查找并翻译节点内的所有文本元素
                      const elementsToTranslate = node.querySelectorAll(
                        'h1, h2, h3, h4, h5, h6, p, span, a, button, li, div, label'
                      );
                      
                      if (elementsToTranslate.length > 0) {
                        Array.from(elementsToTranslate).forEach(function(el) {
                          if (el && 
                              !el.hasAttribute('data-original-text') &&
                              el.parentNode) {
                            translateNode(el);
                          }
                        });
                      }
                    });
                  } catch (error) {
                    console.error('监听器处理DOM变化错误:', error);
                  }
                });
              });
              
              // 翻译单个节点的辅助函数
              function translateNode(el) {
                try {
                  // 跳过图片相关元素
                  if (el.matches('img') || 
                      el.closest('.upload-zone img') ||
                      (el.tagName.toLowerCase() === 'div' && el.querySelector('img') && el.childNodes.length <= 3)) {
                    return;
                  }
                  
                  const text = el.textContent?.trim();
                  if (!text) return;
                  
                  // 尝试从翻译字典查找
                  let translation = window.translationDict[text];
                  
                  // 特殊处理页脚版权信息
                  if (!translation) {
                    if (text.includes('socialphotos.site')) {
                      const footerPattern = /© \d{4}.* 保留所有权利/;
                      if (footerPattern.test(text)) {
                        translation = text.replace('保留所有权利', 'All Rights Reserved');
                      }
                    } else if (/© \d{4}/.test(text)) {
                      // 处理带年份的版权信息
                      for (const [key, value] of Object.entries(window.translationDict)) {
                        if (text.includes(key) && key.length > 5) {
                          translation = text.replace(key, value);
                          break;
                        }
                      }
                    }
                  }
                  
                  // 应用翻译，确保不影响图片
                  if (translation && el.parentNode && !el.querySelector('img')) {
                    el.setAttribute('data-original-text', text);
                    el.textContent = translation;
                  }
                } catch (elemError) {
                  console.log('翻译DOM元素出错:', elemError);
                }
              }
              
              // 设置监听配置并开始观察
              observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: false,
                attributeFilter: ['class', 'id']
              });
              
              // 保存观察器引用
              window.translationObserver = observer;
              console.log('内容变化监听器已设置');
            });
            
            // 自动检测并设置语言
            setTimeout(function() {
              window.detectBrowserLanguage();
            }, 100);
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {/* 语言切换器 - 固定在右上角 */}
        <div className="fixed top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>
        
        {/* 添加翻译器脚本 */}
        <TranslatorScript />
        
        {children}
        <footer className="py-6 text-center text-gray-400 text-sm bg-gray-900">
          <div className="container mx-auto">
            <div className="flex justify-center space-x-4">
              <Link href="/privacy" className="hover:text-gray-200 transition-colors">隐私政策</Link>
              <Link href="/terms" className="hover:text-gray-200 transition-colors">服务条款</Link>
              <Link href="/blog" className="hover:text-gray-200 transition-colors">博客</Link>
            </div>
            <p className="mt-2">© 2025 • socialphotos.site 保留所有权利。</p>
          </div>
        </footer>
      </body>
    </html>
  );
}