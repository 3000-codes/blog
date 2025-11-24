'use client';

import React from 'react';
import { GlassCard } from './GlassCard';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export const CalendarWidget: React.FC = () => {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();

  // Configuration for the heatmap grid
  const rows = 7; // Days of week
  const cols = 18; // Weeks to show (fitting roughly into the card width)
  
  // Generate random activity levels (0-4)
  // In a real app, this would come from an API
  const getLevel = () => {
    const r = Math.random();
    if (r > 0.92) return 4;
    if (r > 0.8) return 3;
    if (r > 0.6) return 2;
    if (r > 0.4) return 1;
    return 0;
  };

  // Create grid data
  const grid = Array.from({ length: cols }, () => 
    Array.from({ length: rows }, () => getLevel())
  );

  const getStyleForLevel = (level: number) => {
     const baseColor = currentTheme.colors.iconColor;
     if (level === 0) return { backgroundColor: 'rgba(0,0,0,0.05)' };
     
     // Map levels to opacity
     const opacity = [0, 0.2, 0.4, 0.7, 1.0][level];
     return { 
         backgroundColor: baseColor, 
         opacity: opacity 
     };
  };

  return (
    <GlassCard className="flex flex-col p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-bold ${currentTheme.colors.textMain} text-sm sm:text-base`}>{t('widget.contributions')}</h3>
        <div className={`text-xs ${currentTheme.colors.textSub} opacity-70`}>{t('widget.lastYear')}</div>
      </div>
      
      {/* Heatmap Grid */}
      <div className="flex gap-[3px] sm:gap-1.5 justify-center sm:justify-start overflow-hidden">
        {grid.map((col, i) => (
          <div key={i} className="flex flex-col gap-[3px] sm:gap-1.5">
            {col.map((level, j) => (
              <div 
                key={`${i}-${j}`}
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] transition-all hover:scale-125 hover:z-10"
                style={getStyleForLevel(level)}
                title={`Level ${level}`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-4 text-[10px] sm:text-xs text-gray-500">
         <span className="mr-1">{t('widget.less')}</span>
         <div className="w-2.5 h-2.5 rounded-[2px] bg-black/5" />
         <div className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: currentTheme.colors.iconColor, opacity: 0.2 }} />
         <div className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: currentTheme.colors.iconColor, opacity: 0.4 }} />
         <div className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: currentTheme.colors.iconColor, opacity: 0.7 }} />
         <div className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: currentTheme.colors.iconColor, opacity: 1.0 }} />
         <span className="ml-1">{t('widget.more')}</span>
      </div>
    </GlassCard>
  );
};