import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import zhTranslations from './zh.json';
import enTranslations from './en.json';

// 使用现有的翻译数据
const resources = {
  zh: {
    translation: zhTranslations
  },
  en: {
    translation: enTranslations
  }
};

// 检查是否在浏览器环境
const isBrowser = typeof window !== 'undefined';

// 自定义语言检测器
const customLanguageDetector = {
  name: 'customDetector',
  lookup() {
    if (!isBrowser) return 'zh'; // 服务器端默认中文
    
    // 获取浏览器语言
    const browserLang = navigator.language || (navigator as any).userLanguage || '';
    
    // 检查是否为中文（包括各种中文变体：zh, zh-CN, zh-TW, zh-HK等）
    if (browserLang.startsWith('zh')) {
      return 'zh';
    }
    
    // 其他所有语言匹配为英文
    return 'en';
  }
};

i18n
  // 在服务器端使用自定义检测器，在客户端使用自定义检测器+标准检测器
  .use({
    type: 'languageDetector',
    async: false,
    init: () => {},
    detect: () => isBrowser ? customLanguageDetector.lookup() : 'zh',
    cacheUserLanguage: (lng) => {
      if (isBrowser) {
        localStorage.setItem('i18nextLng', lng);
      }
    }
  })
  // 将i18n实例传递给react-i18next
  .use(initReactI18next)
  // 初始化i18next
  .init({
    resources,
    fallbackLng: 'zh', // 默认语言为中文
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // 不转义React已经安全的内容
    },
    
    react: {
      useSuspense: false, // 在SSR环境中禁用Suspense
    }
  });

export default i18n; 