'use client';

import React, { useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BlogPost } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface ArticleModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ post, onClose }) => {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (post) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [post]);

  if (!post) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={`
        relative w-full max-w-3xl max-h-full overflow-hidden flex flex-col
        rounded-[2.5rem] 
        backdrop-blur-2xl
        border border-white/40
        shadow-2xl
        ${currentTheme.colors.cardBg}
        animate-[fadeIn_0.3s_ease-out]
      `}>
        
        {/* Header Image */}
        <div className="h-48 sm:h-64 w-full relative shrink-0">
             <img src={post.coverImage || "https://picsum.photos/800/400"} alt="Cover" className="w-full h-full object-cover" />
             <div className={`absolute inset-0 bg-gradient-to-t ${currentTheme.colors.cardOverlay} to-transparent`} />
             
             <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-colors"
             >
                 <X size={24} />
             </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
             <div className="mb-6">
                 <h1 className={`text-3xl sm:text-4xl font-bold ${currentTheme.colors.textMain} mb-4 leading-tight`}>
                     {post.title}
                 </h1>
                 
                 <div className={`flex items-center gap-4 text-sm ${currentTheme.colors.textSub}`}>
                     <div className="flex items-center gap-1">
                         <Calendar size={14} />
                         <span>{post.date}</span>
                     </div>
                     <div className="flex items-center gap-1">
                         <Clock size={14} />
                         <span>5 {t('article.readTime')}</span>
                     </div>
                 </div>
             </div>

             <div className={`markdown-body ${currentTheme.colors.textMain}`}>
                 <ReactMarkdown>{post.content}</ReactMarkdown>
             </div>

             {/* Footer Area */}
             <div className={`mt-12 pt-8 border-t ${currentTheme.colors.accentBorder} text-center ${currentTheme.colors.textSub} opacity-60 text-sm`}>
                 {t('article.thanks')}
             </div>
        </div>
      </div>
    </div>
  );
};