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

const I18nContext = createContext<I18nContextType>({
  changeLanguage: async () => {},
  currentLanguage: 'en',
  isChangingLanguage: false,
});

// 使用Provider提供上下文
export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  // 监听语言变化
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLanguage(lng);
      setIsChangingLanguage(false);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  // 切换语言
  const changeLanguage = async (lng: string) => {
    if (lng === currentLanguage) return;
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