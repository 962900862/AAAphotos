'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function TranslatorScript() {
  useEffect(() => {
    // 在客户端脚本加载完成后执行
    if (typeof window !== 'undefined') {
      console.log('TranslatorScript组件已挂载');
      
      // 检查翻译脚本是否已加载
      const checkScriptLoaded = () => {
        if (window.translationDict && typeof window.translate === 'function') {
          console.log('翻译脚本已成功加载和初始化');
        } else {
          console.warn('翻译脚本可能未正确加载，正在尝试重新加载...');
          // 尝试手动添加脚本
          const script = document.createElement('script');
          script.src = '/translator.js';
          script.async = true;
          script.onload = () => console.log('手动加载的翻译脚本已加载完成');
          document.body.appendChild(script);
        }
      };
      
      // 给页面足够的时间加载脚本
      setTimeout(checkScriptLoaded, 1000);
    }
    
    // 添加键盘快捷键进行翻译检查（仅在开发环境中）
    const isLocalDev = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    
    if (isLocalDev) {
      const checkTranslation = (e: KeyboardEvent) => {
        // Ctrl+Shift+T 检查未翻译文本
        if (e.ctrlKey && e.shiftKey && e.key === 'T') {
          e.preventDefault();
          if (window.checkUntranslatedTexts) {
            window.checkUntranslatedTexts();
            console.log('手动触发翻译检查');
          } else {
            console.warn('翻译检查函数不可用，脚本可能未正确加载');
          }
        }
      };
      
      window.addEventListener('keydown', checkTranslation);
      return () => window.removeEventListener('keydown', checkTranslation);
    }
  }, []);
  
  return (
    <>
      <Script
        id="translator-script"
        src="/translator.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('翻译器脚本已通过Next.js Script组件加载');
          // 脚本加载后主动检查一次语言设置
          setTimeout(() => {
            if (typeof window !== 'undefined' && window.detectBrowserLanguage) {
              const detectedLang = window.detectBrowserLanguage();
              console.log('检测到的浏览器语言:', detectedLang);
            }
          }, 500);
        }}
        onError={() => {
          console.error('翻译器脚本加载失败');
        }}
      />
    </>
  );
} 