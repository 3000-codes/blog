'use client';

import React from 'react';
import { GlassCard } from './GlassCard';
import { Github, Mail, Music, Play } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { posts } from '../data/posts';

export const GithubWidget: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-black text-white rounded-[2rem] p-4 flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-transform cursor-pointer h-full">
      <Github size={24} />
      <span className="font-bold text-lg">{t('widget.github')}</span>
    </div>
  );
};

export const JuejinWidget: React.FC = () => {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  return (
    <GlassCard className={`flex items-center justify-center gap-2 hover:${currentTheme.colors.accentLightBg} cursor-pointer h-full`} noPadding>
      <div className={`flex items-center justify-center w-full h-16 ${currentTheme.colors.accentText} font-bold`}>
         <span className="text-xl">{t('widget.blog')}</span>
      </div>
    </GlassCard>
  );
};

export const MailWidget: React.FC = () => {
  const { currentTheme } = useTheme();
  return (
    <GlassCard className={`flex items-center justify-center hover:${currentTheme.colors.accentText} cursor-pointer h-full`} noPadding>
      <div className="flex items-center justify-center w-full h-16">
        <Mail size={24} className={`${currentTheme.colors.textSub} transition-colors duration-300`} />
      </div>
    </GlassCard>
  );
};

export const MusicPlayer: React.FC = () => {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  return (
    <GlassCard className="flex items-center gap-4 py-3 px-6">
      <div className={`${currentTheme.colors.accentLightBg} p-2 rounded-full ${currentTheme.colors.accentText}`}>
        <Music size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-bold ${currentTheme.colors.textMain} truncate`}>{t('widget.music')}</div>
        <div className="h-1.5 w-full bg-gray-200/30 rounded-full mt-2 overflow-hidden">
          <div className={`h-full w-1/3 rounded-full animate-pulse ${currentTheme.colors.accentBg}`} />
        </div>
      </div>
      <button className={`w-10 h-10 bg-white/90 rounded-full flex items-center justify-center ${currentTheme.colors.accentText} shadow-sm hover:scale-110 transition-transform`}>
        <Play size={16} fill="currentColor" />
      </button>
    </GlassCard>
  );
};

export const NewArticle: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { currentTheme } = useTheme();
  const { language, t } = useLanguage();
  
  // Filter posts by current language
  const localizedPosts = posts.filter(p => p.language === language);
  const latestPost = localizedPosts.length > 0 ? localizedPosts[0] : posts[0];

  return (
    <GlassCard className="h-full flex gap-4 items-center" onClick={onClick}>
        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
          <img src={latestPost?.coverImage || "https://picsum.photos/100/100"} alt="thumb" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <span className={`text-xs ${currentTheme.colors.textSub} mb-1`}>{t('widget.latest')}</span>
          <h4 className={`font-bold ${currentTheme.colors.textMain} leading-tight mb-1 line-clamp-1`}>
            {latestPost?.title || "No posts found"}
          </h4>
          <span className={`text-xs ${currentTheme.colors.textSub} opacity-70`}>{latestPost?.date || ""}</span>
        </div>
    </GlassCard>
  );
};