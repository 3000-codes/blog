'use client';

import React from 'react';
import { GlassCard } from './GlassCard';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export const CalendarWidget: React.FC = () => {
  const { currentTheme } = useTheme();
  const { t, language } = useLanguage();
  
  const weekDays = t('calendar.weekdays').split(',');
  // Static data mimicking the screenshot layout logic
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const startDayOffset = 6; // Starts on a Saturday
  
  const currentDate = 21;
  const dateString = language === 'zh' ? '2025年11月21日 星期五' : '2025/11/21 Friday';

  return (
    <GlassCard className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className={`text-lg ${currentTheme.colors.textSub} font-medium`}>{dateString}</h3>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center flex-1">
        {weekDays.map(d => (
          <div key={d} className={`${currentTheme.colors.accentText} opacity-70 text-xs font-bold mb-2 uppercase`}>{d}</div>
        ))}
        
        {/* Empty cells for offset */}
        {Array.from({ length: startDayOffset }).map((_, i) => (
           <div key={`empty-${i}`} />
        ))}

        {days.map(d => (
          <div 
            key={d} 
            className={`
              aspect-square flex items-center justify-center text-sm font-medium rounded-xl transition-all
              ${d === currentDate 
                ? `${currentTheme.colors.accentBg} shadow-lg ${currentTheme.colors.shadow} scale-110` 
                : `${currentTheme.colors.textSub} hover:${currentTheme.colors.accentLightBg} cursor-pointer`}
            `}
          >
            {d}
          </div>
        ))}
      </div>
    </GlassCard>
  );
};