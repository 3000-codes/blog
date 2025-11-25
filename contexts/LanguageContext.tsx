
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    'status.inDev': 'In Development',
    'sidebar.general': 'General',
    'sidebar.recent': 'Recent Articles',
    'sidebar.projects': 'My Projects',
    'sidebar.about': 'About Me',
    'sidebar.recommend': 'Yellow Pages',
    'sidebar.awesome': 'Awesome Blogs',
    'sidebar.copyright': '© 2025 Suni Blog',
    
    'hero.greeting': 'Good Evening',
    'hero.im': "I'm",
    'hero.meet': 'Nice to meet you!',
    
    'widget.github': 'Github',
    'widget.blog': 'My Blog',
    'widget.music': 'Random Music',
    'widget.latest': 'Latest Article',
    
    'widget.contributions': 'Contributions',
    'widget.lastYear': 'Last Year',
    'widget.less': 'Less',
    'widget.more': 'More',
    
    'calendar.weekdays': 'Sun,Mon,Tue,Wed,Thu,Fri,Sat',
    
    'settings.theme': 'Theme',
    'settings.waterDrop': 'Water Drop',
    'settings.size': 'Size',
    'settings.language': 'Language',
    
    'article.readTime': 'min read',
    'article.thanks': 'Thanks for reading!',

    'resources.title': 'Yellow Pages',
    'resources.subtitle': 'Curated list of useful tools and resources',
    'resources.dev': 'Development',
    'resources.design': 'Design',
    'resources.tools': 'Productivity',
    'resources.visit': 'Visit',
  },
  zh: {
    'status.inDev': '开发中',
    'sidebar.general': '常规',
    'sidebar.recent': '近期文章',
    'sidebar.projects': '我的项目',
    'sidebar.about': '关于网站',
    'sidebar.recommend': '资源黄页',
    'sidebar.awesome': '优秀博客',
    'sidebar.copyright': '© 2025 Suni 博客',
    
    'hero.greeting': '晚上好',
    'hero.im': '我是',
    'hero.meet': '很高兴见到你！',
    
    'widget.github': 'Github',
    'widget.blog': '掘金主页',
    'widget.music': '随机音乐',
    'widget.latest': '最新文章',

    'widget.contributions': '贡献活跃度',
    'widget.lastYear': '过去一年',
    'widget.less': '少',
    'widget.more': '多',
    
    'calendar.weekdays': '日,一,二,三,四,五,六',
    
    'settings.theme': '主题',
    'settings.waterDrop': '水珠效果',
    'settings.size': '大小',
    'settings.language': '语言',
    
    'article.readTime': '分钟阅读',
    'article.thanks': '感谢阅读！',

    'resources.title': '资源黄页',
    'resources.subtitle': '精选的开发设计工具与资源集合',
    'resources.dev': '开发技术',
    'resources.design': '设计灵感',
    'resources.tools': '效率工具',
    'resources.visit': '访问',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh'); // Default to Chinese as per original design

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
