'use client';

import React from 'react';
import { GlassCardProps } from '../types';
import { useTheme } from '../contexts/ThemeContext';

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', noPadding = false, onClick }) => {
  const { currentTheme } = useTheme();

  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden
        backdrop-blur-xl 
        border 
        shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] 
        rounded-[2rem]
        transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:scale-[1.01]
        ${currentTheme.colors.cardBg}
        ${currentTheme.colors.cardBorder}
        ${noPadding ? '' : 'p-6'} 
        ${className}
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* Glossy reflection effect at top - opacity controlled by theme */}
      <div className={`absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b ${currentTheme.colors.cardOverlay} to-transparent pointer-events-none`} />
      
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};