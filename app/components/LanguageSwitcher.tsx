"use client";

import { useState, useEffect } from 'react';
import { GlobeIcon } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const [isEnglish, setIsEnglish] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // 检查是否有保存的语言偏好
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('preferred-language');
      if (savedLang === 'en') {
        setIsEnglish(true);
      }

      // 点击外部关闭下拉菜单
      const handleClickOutside = (e: MouseEvent) => {
        if (isDropdownOpen) {
          const target = e.target as HTMLElement;
          if (!target.closest('.language-switcher')) {
            setIsDropdownOpen(false);
          }
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const switchToLanguage = (lang: 'zh' | 'en') => {
    if (isChanging) return;
    
    // 如果当前已经是选择的语言，只关闭菜单
    if ((lang === 'en' && isEnglish) || (lang === 'zh' && !isEnglish)) {
      setIsDropdownOpen(false);
      return;
    }
    
    setIsChanging(true);
    setIsDropdownOpen(false);
    
    console.log(`正在切换语言到: ${lang}`);
    
    // 调用window方法（如果存在）
    if (typeof window !== 'undefined') {
      if (window.setLanguage) {
        window.setLanguage(lang);
        console.log('已调用window.setLanguage');
      } else {
        console.warn('window.setLanguage 不可用');
      }
    }
    
    // 保存偏好到localStorage
    try {
      localStorage.setItem('preferred-language', lang);
    } catch (e) {
      console.error('无法保存语言偏好:', e);
    }
    
    // 更新UI状态
    setIsEnglish(lang === 'en');
    
    // 动画结束后重置状态
    setTimeout(() => {
      setIsChanging(false);
    }, 500);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="language-switcher relative">
      <button 
        onClick={toggleDropdown}
        disabled={isChanging}
        className={`flex items-center space-x-2 bg-gray-800/80 hover:bg-gray-700/90 backdrop-blur-sm text-white rounded-full px-4 py-2 text-sm font-medium border border-gray-700/50 transition-all duration-200 shadow-md ${className}`}
      >
        <GlobeIcon className="w-4 h-4 mr-1" />
        <span>
          {isChanging ? (
            "切换中..."
          ) : isEnglish ? (
            "English"
          ) : (
            "中文"
          )}
        </span>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-gray-800/95 backdrop-blur-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1 grid grid-cols-2">
            <button
              className={`px-4 py-2 text-sm text-white hover:bg-gray-700/80 transition-colors flex items-center justify-center ${!isEnglish ? 'bg-gray-700/60 font-medium' : ''}`}
              onClick={() => switchToLanguage('zh')}
            >
              🇨🇳 中文
            </button>
            <button
              className={`px-4 py-2 text-sm text-white hover:bg-gray-700/80 transition-colors flex items-center justify-center ${isEnglish ? 'bg-gray-700/60 font-medium' : ''}`}
              onClick={() => switchToLanguage('en')}
            >
              🇺🇸 English
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 为window属性添加全局类型定义
declare global {
  interface Window {
    setLanguage: (lang: string) => void;
    siteLanguage: string;
    translate: () => Promise<boolean>;
    saveLanguagePreference: (lang: string) => void;
    detectBrowserLanguage: () => string;
    translationDict: Record<string, string>;
    originalTexts: Map<string, string>;
    checkUntranslatedTexts: () => Array<{
      element: HTMLElement;
      text: string;
      position: string;
    }>;
    untranslatedTexts: Array<{
      element: HTMLElement;
      text: string;
      position: string;
    }>;
  }
}
