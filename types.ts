import { ReactNode } from 'react';

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
  onClick?: () => void;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export type ThemeName = 'spring' | 'summer' | 'autumn' | 'winter' | 'dark';

export type Language = 'en' | 'zh';

export interface ThemeColors {
  background: string;
  orb1: string;
  orb2: string;
  accentText: string;
  accentBg: string; // Usually includes text color for the bg (e.g. text-white bg-teal-500)
  accentBorder: string;
  accentLightBg: string;
  shadow: string;
  selection: string;
  iconColor: string; // Hex code for inline SVGs if needed
  
  // Structural Colors for Dark Mode support
  cardBg: string;
  cardBorder: string;
  cardOverlay: string; // Gradient overlay on cards
  textMain: string;
  textSub: string;
}

export interface Theme {
  name: ThemeName;
  label: string;
  colors: ThemeColors;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  coverImage?: string;
  summary: string;
  content: string; // Markdown content
  language: Language;
}