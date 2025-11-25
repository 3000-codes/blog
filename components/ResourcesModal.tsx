
'use client';

import React, { useEffect } from 'react';
import { X, ExternalLink, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { resources } from '../data/resources';
import { GlassCard } from './GlassCard';

interface ResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResourcesModal: React.FC<ResourcesModalProps> = ({ isOpen, onClose }) => {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={`
        relative w-full max-w-5xl h-[85vh] flex flex-col
        rounded-[2.5rem] 
        backdrop-blur-2xl
        border border-white/40
        shadow-2xl
        ${currentTheme.colors.cardBg}
        animate-[fadeIn_0.3s_ease-out]
      `}>
        
        {/* Header */}
        <div className="p-8 pb-4 flex items-start justify-between shrink-0">
             <div>
                 <h1 className={`text-3xl font-bold ${currentTheme.colors.textMain} flex items-center gap-3`}>
                     <Globe className={currentTheme.colors.accentText} size={32} />
                     {t('resources.title')}
                 </h1>
                 <p className={`mt-2 ${currentTheme.colors.textSub}`}>{t('resources.subtitle')}</p>
             </div>
             
             <button 
                onClick={onClose}
                className={`p-3 rounded-full ${currentTheme.colors.accentLightBg} ${currentTheme.colors.accentText} hover:scale-110 transition-transform`}
             >
                 <X size={24} />
             </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 pt-2 custom-scrollbar">
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {resources.map((category) => (
                     <div key={category.id} className="flex flex-col gap-4">
                         <h3 className={`text-lg font-bold ${currentTheme.colors.textMain} border-b ${currentTheme.colors.accentBorder} pb-2 uppercase tracking-wide opacity-80`}>
                             {t(category.id)}
                         </h3>
                         
                         <div className="flex flex-col gap-3">
                             {category.items.map((item) => (
                                 <a 
                                    key={item.url} 
                                    href={item.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="group"
                                 >
                                     <GlassCard className="flex items-center gap-4 hover:-translate-y-1 transition-transform !p-4 group-hover:bg-white/60">
                                         <div className="w-10 h-10 rounded-xl bg-white/80 p-1.5 shadow-sm shrink-0 flex items-center justify-center overflow-hidden">
                                             <img 
                                                src={`https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}&sz=64`} 
                                                alt="icon" 
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                             />
                                             <Globe size={20} className={`absolute ${currentTheme.colors.textSub} opacity-20 -z-10`} />
                                         </div>
                                         
                                         <div className="flex-1 min-w-0">
                                             <div className="flex items-center justify-between">
                                                 <h4 className={`font-bold ${currentTheme.colors.textMain} truncate group-hover:${currentTheme.colors.accentText} transition-colors`}>
                                                     {item.title}
                                                 </h4>
                                                 <ExternalLink size={12} className={`${currentTheme.colors.textSub} opacity-0 group-hover:opacity-50 transition-opacity`} />
                                             </div>
                                             <p className={`text-xs ${currentTheme.colors.textSub} truncate opacity-70`}>
                                                 {item.description}
                                             </p>
                                         </div>
                                     </GlassCard>
                                 </a>
                             ))}
                         </div>
                     </div>
                 ))}
             </div>

             {/* Footer Area */}
             <div className={`mt-12 pt-8 text-center ${currentTheme.colors.textSub} opacity-40 text-sm`}>
                 {t('sidebar.copyright')}
             </div>
        </div>
      </div>
    </div>
  );
};
