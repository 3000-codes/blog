'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { Quote } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const quotes = [
  {
    en: "The best way to predict the future is to create it.",
    zh: "预测未来的最好方式就是去创造它。",
    author: "Peter Drucker"
  },
  {
    en: "Stay hungry, stay foolish.",
    zh: "求知若饥，虚心若愚。",
    author: "Steve Jobs"
  },
  {
    en: "Simplicity is the ultimate sophistication.",
    zh: "至繁归于至简。",
    author: "Leonardo da Vinci"
  },
  {
    en: "Code is like humor. When you have to explain it, it’s bad.",
    zh: "代码就像幽默。当你必须解释它时，它就很糟糕。",
    author: "Cory House"
  },
  {
    en: "Life is what happens when you're busy making other plans.",
    zh: "生活就是当你忙着制定其他计划时发生的事情。",
    author: "John Lennon"
  },
  {
    en: "Believe you can and you're halfway there.",
    zh: "相信你能做到，你就已经成功了一半。",
    author: "Theodore Roosevelt"
  }
];

export const QuoteWidget: React.FC = () => {
  const { currentTheme } = useTheme();
  const [quote, setQuote] = useState(quotes[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Use the day of the year to select a "daily" quote consistently for the day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    setQuote(quotes[dayOfYear % quotes.length]);
  }, []);

  if (!mounted) return null;

  return (
    <GlassCard className="flex flex-col justify-center h-full min-h-[160px] relative group p-6 overflow-hidden">
      {/* Background Icon */}
      <div className={`absolute -top-2 -right-2 ${currentTheme.colors.accentText} opacity-5 group-hover:opacity-10 transition-all duration-500 rotate-12`}>
        <Quote size={120} />
      </div>
      
      <div className="relative z-10">
         <div className="flex gap-2 mb-3">
             <Quote size={20} className={`${currentTheme.colors.accentText} opacity-60`} />
         </div>
         
         <p className={`text-lg font-bold ${currentTheme.colors.textMain} mb-2 leading-relaxed font-quicksand`}>
           {quote.en}
         </p>
         <p className={`text-base ${currentTheme.colors.textSub} mb-4 font-medium opacity-80`}>
           {quote.zh}
         </p>
         
         <div className={`flex items-center gap-2 text-xs font-bold ${currentTheme.colors.accentText} uppercase tracking-wider`}>
            <span className={`w-6 h-[2px] ${currentTheme.colors.accentBg} rounded-full`}></span>
            {quote.author}
         </div>
      </div>
    </GlassCard>
  );
};
