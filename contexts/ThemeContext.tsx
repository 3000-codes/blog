'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Theme, ThemeName } from '../types';

const themes: Record<ThemeName, Theme> = {
  spring: {
    name: 'spring',
    label: 'Spring',
    colors: {
      background: 'bg-gradient-to-br from-[#d4fcfe] via-[#e6f7ff] to-[#fcfce3]',
      orb1: 'bg-green-200/30',
      orb2: 'bg-yellow-200/30',
      accentText: 'text-teal-600',
      accentBg: 'bg-teal-400 text-white',
      accentBorder: 'border-teal-200',
      accentLightBg: 'bg-teal-100/50',
      shadow: 'shadow-teal-200',
      selection: 'selection:bg-teal-200 selection:text-teal-900',
      iconColor: '#0d9488',
      cardBg: 'bg-white/40',
      cardBorder: 'border-white/60',
      cardOverlay: 'from-white/40',
      textMain: 'text-gray-800',
      textSub: 'text-gray-600',
    }
  },
  summer: {
    name: 'summer',
    label: 'Summer',
    colors: {
      background: 'bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#e0f2fe]',
      orb1: 'bg-blue-400/20',
      orb2: 'bg-sky-300/20',
      accentText: 'text-blue-600',
      accentBg: 'bg-blue-500 text-white',
      accentBorder: 'border-blue-200',
      accentLightBg: 'bg-blue-100/50',
      shadow: 'shadow-blue-200',
      selection: 'selection:bg-blue-200 selection:text-blue-900',
      iconColor: '#2563eb',
      cardBg: 'bg-white/40',
      cardBorder: 'border-white/60',
      cardOverlay: 'from-white/40',
      textMain: 'text-gray-800',
      textSub: 'text-gray-600',
    }
  },
  autumn: {
    name: 'autumn',
    label: 'Autumn',
    colors: {
      background: 'bg-gradient-to-br from-[#fff7ed] via-[#ffedd5] to-[#fed7aa]',
      orb1: 'bg-orange-300/20',
      orb2: 'bg-amber-200/20',
      accentText: 'text-orange-600',
      accentBg: 'bg-orange-500 text-white',
      accentBorder: 'border-orange-200',
      accentLightBg: 'bg-orange-100/50',
      shadow: 'shadow-orange-200',
      selection: 'selection:bg-orange-200 selection:text-orange-900',
      iconColor: '#ea580c',
      cardBg: 'bg-white/40',
      cardBorder: 'border-white/60',
      cardOverlay: 'from-white/40',
      textMain: 'text-gray-800',
      textSub: 'text-gray-600',
    }
  },
  winter: {
    name: 'winter',
    label: 'Winter',
    colors: {
      background: 'bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1]',
      orb1: 'bg-slate-300/30',
      orb2: 'bg-indigo-200/20',
      accentText: 'text-indigo-600',
      accentBg: 'bg-indigo-500 text-white',
      accentBorder: 'border-indigo-200',
      accentLightBg: 'bg-indigo-100/50',
      shadow: 'shadow-indigo-200',
      selection: 'selection:bg-indigo-200 selection:text-indigo-900',
      iconColor: '#4f46e5',
      cardBg: 'bg-white/40',
      cardBorder: 'border-white/60',
      cardOverlay: 'from-white/40',
      textMain: 'text-gray-800',
      textSub: 'text-gray-600',
    }
  },
  dark: {
    name: 'dark',
    label: 'Dark Mode',
    colors: {
      background: 'bg-slate-950',
      orb1: 'bg-purple-900/20',
      orb2: 'bg-cyan-900/20',
      accentText: 'text-cyan-400',
      accentBg: 'bg-cyan-600 text-white',
      accentBorder: 'border-cyan-700',
      accentLightBg: 'bg-cyan-900/30',
      shadow: 'shadow-cyan-900/50',
      selection: 'selection:bg-cyan-500/30 selection:text-cyan-200',
      iconColor: '#22d3ee',
      cardBg: 'bg-slate-900/60',
      cardBorder: 'border-slate-700/50',
      cardOverlay: 'from-white/5',
      textMain: 'text-slate-200',
      textSub: 'text-slate-400',
    }
  }
};

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (name: ThemeName) => void;
  showWaterDrop: boolean;
  setShowWaterDrop: (show: boolean) => void;
  waterDropSize: number;
  setWaterDropSize: (size: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes.spring);
  const [showWaterDrop, setShowWaterDrop] = useState(false);
  const [waterDropSize, setWaterDropSize] = useState(32); // Default 32px

  const setTheme = (name: ThemeName) => {
    setCurrentTheme(themes[name]);
  };

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      setTheme,
      showWaterDrop,
      setShowWaterDrop,
      waterDropSize,
      setWaterDropSize
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};