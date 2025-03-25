import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import Script from 'next/script';
import { metadata as pageMetadata } from './page-metadata';

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
          /* 翻译按钮样式 */
          #translator-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            padding: 8px 12px;
            background-color: rgba(0, 0, 0, 0.6);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
          }
          #translator-btn:hover {
            background-color: rgba(0, 0, 0, 0.8);
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
              "支持朋友圈超清图片、小红书高清封面和4K蓝光增强，满足各类社交媒体的图片需求": "Supports WeChat Moments HD images, Xiaohongshu high-definition covers, and 4K Blu-ray enhancement, meeting the image needs of various social media platforms",
              "CodeFormer AI模型能精准识别人脸细节，修复失真和模糊，让人像更加自然清晰": "CodeFormer AI model can accurately identify facial details, fix distortion and blur, making portraits more natural and clear",
              
              // 使用案例部分
              "使用案例": "Case Study",
              "超清处理效果展示 - 告别压缩失真，呈现原始画质": "HD processing effect display - Say goodbye to compression distortion, presenting original image quality",
              
              // FAQ部分
              "常见问题": "FAQ",
              "如何使用这个工具？": "How to use this tool?",
              "支持哪些图片格式？": "What image formats are supported?",
              "处理后的图片会占用更多空间吗？": "Will processed images take up more space?",
              "小红书封面和朋友圈图片有什么区别？": "What's the difference between Xiaohongshu cover and WeChat Moments images?",
              "什么是4K蓝光增强？": "What is 4K Blu-ray enhancement?",
              "只需将您的图片拖入上传区域或点击选择文件，选择需要的格式（朋友圈、小红书或4K蓝光），点击开始处理即可。处理完成后可以下载或直接分享。": "Simply drag your image into the upload area or click to select a file, choose the required format (WeChat Moments, Xiaohongshu, or 4K Blu-ray), and click to start processing. After processing, you can download or share directly.",
              "目前支持主流图片格式，包括JPG、PNG、WEBP等。建议上传原图以获得最佳效果。": "Currently supports mainstream image formats, including JPG, PNG, WEBP, etc. It is recommended to upload the original image for the best results.",
              "不会，我们采用智能压缩技术，在提升画质的同时保持合理的文件大小。": "No, we use intelligent compression technology to maintain a reasonable file size while improving image quality.",
              "小红书封面会按照平台推荐的3:4比例进行优化处理再进行像素ai增强，而朋友圈图片则保持短边1080px的高清标准。": "Xiaohongshu covers are optimized according to the platform's recommended 3:4 ratio and then enhanced with pixel AI, while WeChat Moments images maintain the HD standard with a short edge of 1080px.",
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
              "小红书高清主页打造攻略：脱颖而出的视觉密码": "Xiaohongshu HD Profile Creation Strategy: The Visual Code to Stand Out",
              "2024年最佳微信朋友圈高清图片工具对比分析": "Comparative Analysis of the Best WeChat Moments HD Image Tools in 2024",
              "揭秘微信朋友圈图片压缩机制及应对策略": "Revealing WeChat Moments Image Compression Mechanism and Coping Strategies",
              "微信朋友圈, 高清照片, 实用技巧": "WeChat Moments, HD Photos, Practical Tips",
              "小红书, 主页优化, 图片处理": "Xiaohongshu, Profile Optimization, Image Processing",
              
              // 工具使用相关
              "拖放图片到这里或点击上传": "Drop images here or click to upload",
              "支持的格式": "Supported formats",
              "最大": "Max",
              "选择增强模式": "Select Enhancement Mode",
              "朋友圈高清图": "WeChat Moments HD",
              "小红书封面图": "Xiaohongshu Cover",
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
              "小红书封面": "Xiaohongshu Cover",
              "朋友圈模式：短边1080px，长边等比例缩放，确保图片在朋友圈显示清晰不被压缩": "WeChat Moments mode: 1080px short edge, proportional scaling for long edge, ensuring clear display without compression",
              "小红书模式：3:4比例，1280*1706像素，确保在小红书上获得最佳展示效果不被压缩": "Xiaohongshu mode: 3:4 ratio, 1280*1706 pixels, ensuring optimal display without compression",
              "4K蓝光模式：提升至4K级别，应用蓝光级别的细节和色彩增强（在线处理，根据您的网速，大约需要10-30秒）": "4K Blu-ray mode: Enhances to 4K level, applies Blu-ray quality detail and color enhancement (online processing, takes about 10-30 seconds depending on your internet speed)",
              "处理进度": "Processing Progress",
              "处理": "Process",
              "处理中": "Processing",
              "模式已切换": "Mode Switched",
              "已切换至4K蓝光模式，请点击处理按钮": "Switched to 4K Blu-ray mode, please click the Process button",
              "已切换至朋友圈超清模式，请点击处理按钮": "Switched to WeChat Moments HD mode, please click the Process button",
              "已切换至小红书封面模式，请点击处理按钮": "Switched to Xiaohongshu Cover mode, please click the Process button",
              "拖入图片或点击上传": "Drag image here or click to upload",
              "支持 JPG、PNG 等图片格式": "Supports JPG, PNG and other image formats",
              "小红书最佳封面模式已开启": "Xiaohongshu best cover mode enabled",
              "处理完成，可以下载或分享到朋友圈": "Processing complete, ready to download or share to WeChat Moments",
              "处理完成，可以下载或上传到小红书": "Processing complete, ready to download or upload to Xiaohongshu",
              "处理完成，可以下载您的4K蓝光增强图": "Processing complete, ready to download your 4K Blu-ray enhanced image",
              "模式已切换为朋友圈超清，点击处理按钮重新优化": "Mode switched to WeChat Moments HD, click Process button to optimize again",
              "模式已切换为小红书封面，点击处理按钮重新优化": "Mode switched to Xiaohongshu Cover, click Process button to optimize again",
              "模式已切换为4K蓝光增强，点击处理按钮重新优化": "Mode switched to 4K Blu-ray enhancement, click Process button to optimize again",
              "已上传图片，点击处理按钮开始优化": "Image uploaded, click Process button to start optimization",
              "原图": "Original",
              "4K增强": "4K Enhanced",
              "朋友圈已优化": "WeChat Moments Optimized",
              "小红书已优化": "Xiaohongshu Optimized",
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
              "切换语言": "Switch Language"
            };
            
            // 保存页面状态
            window.siteLanguage = 'zh';  // 默认中文
            window.originalTexts = new Map();  // 存储原始文本
            
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
            
            // 添加翻译函数到window对象 - 优化版本
            window.translate = function() {
              try {
                const isCurrentlyEnglish = window.siteLanguage === 'en';
                const newLanguage = isCurrentlyEnglish ? 'zh' : 'en';
                
                // 更新按钮文本和状态，立即响应用户操作
                const btn = document.getElementById('translator-btn');
                if (btn) {
                  // 禁用按钮以防止重复点击
                  btn.disabled = true;
                  
                  // 显示加载状态
                  const originalText = btn.textContent;
                  btn.textContent = isCurrentlyEnglish ? '切换中...' : 'Switching...';
                  
                  // 异步执行翻译操作
                  setTimeout(() => {
                    if (isCurrentlyEnglish) {
                      // 从英文切换到中文 - 使用安全的引用方式
                      document.querySelectorAll('[data-original-text]').forEach(el => {
                        if (el && el.getAttribute('data-original-text')) {
                          el.textContent = el.getAttribute('data-original-text');
                          el.removeAttribute('data-original-text');
                        }
                      });
                      window.siteLanguage = 'zh';
                      btn.textContent = '🇺🇸 English';
                    } else {
                      // 从中文切换到英文 - 使用更高效的选择器
                      document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, li, div.text-sm, div.text-lg, footer, footer *').forEach(el => {
                        // 跳过翻译按钮自身
                        if (el && el.textContent && el.id !== 'translator-btn' && !el.getAttribute('data-original-text')) {
                          const text = el.textContent.trim();
                          let translation = window.translationDict[text];
                          
                          // 如果精确匹配没有找到翻译，尝试特殊处理页脚版权信息
                          if (!translation && text.includes('socialphotos.site')) {
                            // 尝试匹配页脚版权文本
                            const footerPattern = /© \d{4}.* 保留所有权利/;
                            if (footerPattern.test(text)) {
                              translation = text.replace('保留所有权利', 'All Rights Reserved');
                            }
                          }
                          
                          // 如果内容含有年份，可能是版权信息，进行特殊处理
                          if (!translation && /© \d{4}/.test(text)) {
                            for (const [key, value] of Object.entries(window.translationDict)) {
                              if (text.includes(key) && key.length > 5) {
                                translation = text.replace(key, value);
                                break;
                              }
                            }
                          }
                          
                          if (translation) {
                            // 使用数据属性存储原始文本，而不是引用DOM节点
                            el.setAttribute('data-original-text', text);
                            el.textContent = translation;
                          }
                        }
                      });
                      
                      window.siteLanguage = 'en';
                      btn.textContent = '🇨🇳 中文';
                    }
                    
                    // 保存用户语言偏好
                    window.saveLanguagePreference(window.siteLanguage);
                    
                    // 恢复按钮状态
                    btn.disabled = false;
                    
                    console.log('语言切换成功:', window.siteLanguage);
                  }, 10); // 使用最小延迟，确保UI能够立即响应
                  
                  return true;
                }
              } catch (error) {
                console.error('翻译过程出错:', error);
                // 恢复按钮状态
                const btn = document.getElementById('translator-btn');
                if (btn) {
                  btn.disabled = false;
                  btn.textContent = window.siteLanguage === 'en' ? '🇨🇳 中文' : '🇺🇸 English';
                }
                return false;
              }
            };
            
            // 立即初始化翻译按钮
            window.initTranslator = function() {
              const btn = document.getElementById('translator-btn');
              if (btn) {
                // 根据当前语言设置按钮文本
                const detectedLang = window.detectBrowserLanguage();
                if (detectedLang === 'en') {
                  btn.textContent = '🇨🇳 中文';
                } else {
                  btn.textContent = '🇺🇸 English';
                }
                
                // 添加点击事件监听器
                btn.onclick = function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  window.translate();
                };
                console.log('翻译按钮已初始化');
              } else {
                console.warn('找不到翻译按钮，将在页面加载完成后再次尝试');
              }
            };
            
            // 确保翻译按钮在各种情况下都能被初始化
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
              window.initTranslator();
            } else {
              document.addEventListener('DOMContentLoaded', window.initTranslator);
            }
            
            // 兜底方案，确保在窗口完全加载后按钮一定可用
            window.addEventListener('load', window.initTranslator);
          `}
        </Script>
        
        {/* 翻译按钮点击事件处理脚本 */}
        <Script id="translator-observer" strategy="lazyOnload">
          {`
            // 设置动态内容监听
            function setupMutationObserver() {
              const observer = new MutationObserver(function(mutations) {
                // 如果当前是英文，重新应用翻译
                if (window.siteLanguage === 'en') {
                  // 使用requestAnimationFrame优化性能
                  requestAnimationFrame(function() {
                    // 仅对新增的元素应用翻译
                    mutations.forEach(function(mutation) {
                      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(function(node) {
                          if (node.nodeType === 1) { // 元素节点
                            // 处理元素本身
                            if (node.textContent && node.id !== 'translator-btn' && !node.getAttribute('data-original-text')) {
                              const text = node.textContent.trim();
                              const translation = window.translationDict[text];
                              if (translation) {
                                node.setAttribute('data-original-text', text);
                                node.textContent = translation;
                              }
                            }
                            
                            // 使用更高效的选择器处理子元素
                            const newElements = node.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, li, div, footer *');
                            if (newElements.length > 0) {
                              newElements.forEach(function(el) {
                                if (el && el.id !== 'translator-btn' && !el.getAttribute('data-original-text')) {
                                  const text = el.textContent?.trim();
                                  if (text) {
                                    // 先尝试精确匹配
                                    let translation = window.translationDict[text];
                                    
                                    // 如果精确匹配未找到，尝试部分匹配
                                    if (!translation && text.includes('socialphotos.site')) {
                                      const footerPattern = /© \d{4}.* 保留所有权利/;
                                      if (footerPattern.test(text)) {
                                        translation = text.replace('保留所有权利', 'All Rights Reserved');
                                      }
                                    }
                                    
                                    if (translation) {
                                      el.setAttribute('data-original-text', text);
                                      el.textContent = translation;
                                    }
                                  }
                                }
                              });
                            }
                          }
                        });
                      }
                    });
                  });
                }
              });
              
              // 开始观察文档变化，使用性能更好的配置
              observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true,
                attributeFilter: ['class', 'id'] // 只观察特定属性变化
              });
              
              console.log('内容变化监听器已设置');
            }
            
            // 在页面加载完成后设置监听器
            if (document.readyState === 'complete') {
              setupMutationObserver();
            } else {
              window.addEventListener('load', setupMutationObserver);
            }
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {/* 使用具有更明显视觉反馈的按钮 */}
        <button 
          id="translator-btn" 
          title="点击切换语言 / Click to switch language"
          className="translator-btn"
          aria-label="Language Switch"
        >
          🇺🇸 English
        </button>
        
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