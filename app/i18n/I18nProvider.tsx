'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';

// 创建上下文
type I18nContextType = {
  changeLanguage: (lng: string) => Promise<void>;
  currentLanguage: string;
  isChangingLanguage: boolean;
};

// 初始状态使用服务器端默认值
const I18nContext = createContext<I18nContextType>({
  changeLanguage: async () => {},
  currentLanguage: 'zh', // 服务器端默认使用中文
  isChangingLanguage: false,
});

// 获取自动检测的语言
function getAutoDetectedLanguage(): string {
  // 服务器端始终返回中文
  if (typeof window === 'undefined') return 'zh';
  
  // 从浏览器获取语言
  const browserLang = navigator.language || (navigator as any).userLanguage || '';
  
  // 如果是中文变体，返回中文
  if (browserLang.startsWith('zh')) return 'zh';
  
  // 其他所有语言返回英文
  return 'en';
}

// 使用Provider提供上下文
export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  // 初始语言设置为zh，确保与服务器端渲染一致
  const [currentLanguage, setCurrentLanguage] = useState('zh');
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  // 组件挂载后自动检测并应用语言
  useEffect(() => {
    setIsMounted(true);
    
    // 首先检查是否有已保存的语言设置
    const savedLanguage = localStorage.getItem('i18nextLng');
    
    if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
      // 使用已保存的语言设置
      if (savedLanguage !== currentLanguage) {
        setTimeout(() => {
          i18n.changeLanguage(savedLanguage);
        }, 0);
      }
    } else {
      // 没有已保存的语言，使用自动检测的语言
      const autoDetectedLang = getAutoDetectedLanguage();
      if (autoDetectedLang !== currentLanguage) {
        setTimeout(() => {
          i18n.changeLanguage(autoDetectedLang);
        }, 0);
      }
    }
  }, []);

  // 监听语言变化
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLanguage(lng);
      setIsChangingLanguage(false);
      // 保存语言设置到 localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('i18nextLng', lng);
      }
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  // 切换语言
  const changeLanguage = async (lng: string) => {
    if (lng === currentLanguage || !isMounted) return;
    setIsChangingLanguage(true);
    
    try {
      await i18n.changeLanguage(lng);
      // setCurrentLanguage会通过上面的事件监听器自动更新
    } catch (error) {
      console.error('Failed to change language:', error);
      setIsChangingLanguage(false);
    }
  };

  return (
    <I18nContext.Provider value={{ changeLanguage, currentLanguage, isChangingLanguage }}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </I18nContext.Provider>
  );
};

// 创建hook以便于使用上下文
export const useI18n = () => useContext(I18nContext);

export default I18nProvider; 