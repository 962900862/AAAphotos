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

i18n
  // 检测用户语言
  .use(LanguageDetector)
  // 将i18n实例传递给react-i18next
  .use(initReactI18next)
  // 初始化i18next
  .init({
    resources,
    fallbackLng: 'zh',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // 不转义React已经安全的内容
    },
    
    detection: {
      // 检测选项
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    
    react: {
      useSuspense: false, // 在SSR环境中禁用Suspense
    }
  });

export default i18n; 