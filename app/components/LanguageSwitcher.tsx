'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useI18n } from '../i18n/I18nProvider';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { changeLanguage, currentLanguage, isChangingLanguage } = useI18n();
  const [isMounted, setIsMounted] = useState(false);
  
  // 仅在客户端渲染后显示组件
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // 如果组件未挂载，返回null，避免服务器端和客户端渲染不一致
  if (!isMounted) {
    return null;
  }

  const handleLanguageChange = async () => {
    if (isChangingLanguage) return;
    
    try {
      // 切换语言：中文 <-> 英文
      const nextLanguage = currentLanguage === 'en' ? 'zh' : 'en';
      
      toast({
        title: t('language.switching'),
        description: "",
        duration: 1500
      });
      
      await changeLanguage(nextLanguage);
    } catch (error) {
      console.error('Error changing language:', error);
      toast({
        variant: "destructive",
        title: "Failed to change language",
        description: "请稍后再试"
      });
    }
  };

  return (
    <button
      onClick={handleLanguageChange}
      disabled={isChangingLanguage}
      className={`fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md
                  transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700
                  ${isChangingLanguage ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={t('language.switchTitle')}
      title={t('language.switchTitle')}
    >
      {isChangingLanguage ? (
        <span className="flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
        </span>
      ) : (
        <span className="flex items-center space-x-1">
          <Globe className="h-4 w-4 mr-1" />
          <span className="font-medium text-sm">
            {currentLanguage === 'en' ? t('language.chinese') : t('language.english')}
          </span>
        </span>
      )}
    </button>
  );
};

export default LanguageSwitcher; 