'use client';

import React from 'react';
import { GlassCard } from './GlassCard';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export const ProfileHero: React.FC = () => {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <GlassCard className="flex flex-col items-center justify-center text-center h-full min-h-[300px] relative overflow-hidden group">
      {/* Decorative Circles behind */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${currentTheme.colors.orb1} rounded-full blur-3xl transition-all duration-700`}></div>
      
      <div className="relative z-10">
        <div className={`w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 ${currentTheme.colors.cardBorder} shadow-xl relative`}>
            <img 
                src="https://picsum.photos/300/300?random=2" 
                alt="Avatar" 
                className="w-full h-full object-cover"
            />
        </div>
        
        <h1 className={`text-3xl font-bold ${currentTheme.colors.textMain} mb-2`}>{t('hero.greeting')}</h1>
        <p className={`text-2xl ${currentTheme.colors.textSub} font-medium`}>
          {t('hero.im')} <span className={`${currentTheme.colors.accentText} font-bold inline-block relative`}>
            Suni
            <svg className="absolute w-full h-2 bottom-0 left-0 opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke={currentTheme.colors.iconColor} strokeWidth="8" fill="none" />
            </svg>
          </span>, 
        </p>
        <p className={`text-2xl ${currentTheme.colors.textSub} font-medium`}>{t('hero.meet')}</p>
      </div>
    </GlassCard>
  );
};