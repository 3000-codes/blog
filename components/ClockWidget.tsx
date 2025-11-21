'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { useTheme } from '../contexts/ThemeContext';

export const ClockWidget: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const { currentTheme } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return {
      hours: date.getHours().toString().padStart(2, '0'),
      minutes: date.getMinutes().toString().padStart(2, '0'),
    };
  };

  const { hours, minutes } = formatTime(time);

  return (
    <GlassCard className="flex items-center justify-center min-h-[160px]">
      <div className={`font-orbitron text-6xl lg:text-7xl font-bold ${currentTheme.colors.textMain} tracking-widest flex items-center gap-2 opacity-80`}>
        <span>{hours}</span>
        <span className={`animate-pulse pb-2 ${currentTheme.colors.accentText}`}>:</span>
        <span>{minutes}</span>
      </div>
    </GlassCard>
  );
};