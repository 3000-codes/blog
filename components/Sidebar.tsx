'use client';

import React from 'react';
import { GlassCard } from './GlassCard';
import { FileText, Grid, Info, Star, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }> = ({ icon, label, active, onClick }) => {
  const { currentTheme } = useTheme();
  
  return (
    <div 
      onClick={onClick}
      className={`
      group flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300
      ${active 
        ? `${currentTheme.colors.accentLightBg} shadow-sm ${currentTheme.colors.accentText}` 
        : `hover:${currentTheme.colors.accentLightBg} ${currentTheme.colors.textSub} hover:${currentTheme.colors.accentText}`}
    `}>
      <div className={`transition-transform duration-300 group-hover:scale-110 ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
        {icon}
      </div>
      <span className="font-medium text-lg">{label}</span>
    </div>
  );
};

interface SidebarProps {
    onOpenArticle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenArticle }) => {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <GlassCard className="h-full flex flex-col justify-between">
      <div>
        {/* Profile Header */}
        <div className="flex items-center gap-3 mb-10 pl-2">
          <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${currentTheme.colors.accentBorder} shadow-sm`}>
            <img src="https://picsum.photos/100/100?random=1" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <h2 className={`text-xl font-bold ${currentTheme.colors.textMain} tracking-wide`}>YYSuni</h2>
            <span className={`text-xs ${currentTheme.colors.accentText} ${currentTheme.colors.accentLightBg} px-2 py-0.5 rounded-full w-fit`}>{t('status.inDev')}</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <div className={`text-xs font-bold ${currentTheme.colors.textSub} uppercase tracking-widest mb-4 pl-4 opacity-60`}>{t('sidebar.general')}</div>
          <SidebarItem icon={<FileText size={20} />} label={t('sidebar.recent')} onClick={onOpenArticle} />
          <SidebarItem icon={<Grid size={20} />} label={t('sidebar.projects')} />
          <SidebarItem icon={<Info size={20} />} label={t('sidebar.about')} active />
          <SidebarItem icon={<Star size={20} />} label={t('sidebar.recommend')} />
          <SidebarItem icon={<Globe size={20} />} label={t('sidebar.awesome')} />
        </div>
      </div>
      
      <div className={`text-center ${currentTheme.colors.textSub} text-sm mt-8 opacity-60`}>
        {t('sidebar.copyright')}
      </div>
    </GlassCard>
  );
};