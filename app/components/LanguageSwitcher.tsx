'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useI18n } from '../i18n/I18nProvider';
import { useToast } from "@/hooks/use-toast";

const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { changeLanguage, currentLanguage, isChangingLanguage } = useI18n();

  const handleLanguageChange = async () => {
    if (isChangingLanguage) return;
    
    try {
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
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      ) : (
        <span className="font-medium text-sm">
          {currentLanguage === 'en' ? t('language.chinese') : t('language.english')}
        </span>
      )}
    </button>
  );
};

export default LanguageSwitcher; 