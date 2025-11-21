import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ProfileHero } from './components/ProfileHero';
import { CalendarWidget } from './components/CalendarWidget';
import { ClockWidget } from './components/ClockWidget';
import { WaterDrop } from './components/WaterDrop';
import { GithubWidget, JuejinWidget, MailWidget, MusicPlayer, NewArticle } from './components/Widgets';
import { PenTool, Palette, Droplets, Minimize, Maximize } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import { ThemeName, BlogPost } from './types';
import { SeasonalEffects } from './components/SeasonalEffects';
import { ArticleModal } from './components/ArticleModal';
import { posts } from './data/posts';

const ThemeSwitcher: React.FC = () => {
  const { setTheme, currentTheme, showWaterDrop, setShowWaterDrop, waterDropSize, setWaterDropSize } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const themeOptions: { name: ThemeName; color: string }[] = [
    { name: 'spring', color: 'bg-teal-400' },
    { name: 'summer', color: 'bg-blue-400' },
    { name: 'autumn', color: 'bg-orange-400' },
    { name: 'winter', color: 'bg-indigo-400' },
    { name: 'dark',   color: 'bg-slate-800 border border-gray-500' },
  ];

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`${currentTheme.colors.accentBg} w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${currentTheme.colors.shadow} hover:-translate-y-1 transition-transform`}
      >
        <Palette size={18} />
      </button>
      
      {/* Settings Panel */}
      <div className={`
        absolute top-full right-0 mt-2 p-4 
        bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl 
        border border-white/50 
        flex flex-col gap-4 
        w-64
        origin-top-right transition-all duration-200
        ${isOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}
        z-50
      `}>
        
        {/* Section: Colors */}
        <div>
            <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Theme</div>
            <div className="flex flex-wrap gap-2">
                {themeOptions.map((t) => (
                <button 
                    key={t.name}
                    onClick={() => setTheme(t.name)}
                    className={`w-8 h-8 rounded-full ${t.color} border-2 ${currentTheme.name === t.name ? 'border-gray-600 scale-110' : 'border-transparent hover:scale-110'} transition-all`}
                    title={t.name}
                />
                ))}
            </div>
        </div>

        <div className="h-px bg-gray-200 w-full" />

        {/* Section: Water Drop */}
        <div>
             <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                     <Droplets size={16} className={showWaterDrop ? 'text-blue-500' : 'text-gray-400'} />
                     <span>Water Drop</span>
                 </div>
                 
                 {/* Toggle Switch */}
                 <button 
                    onClick={() => setShowWaterDrop(!showWaterDrop)}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${showWaterDrop ? currentTheme.colors.accentBg : 'bg-gray-300'}`}
                 >
                     <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow transition-transform duration-300 ${showWaterDrop ? 'translate-x-5' : 'translate-x-0'}`} />
                 </button>
             </div>

             {showWaterDrop && (
                 <div className="space-y-2">
                     <div className="flex justify-between text-xs text-gray-500">
                         <Minimize size={12} />
                         <span>Size</span>
                         <Maximize size={12} />
                     </div>
                     <input 
                        type="range" 
                        min="100" 
                        max="500" 
                        step="10"
                        value={waterDropSize}
                        onChange={(e) => setWaterDropSize(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-600"
                     />
                 </div>
             )}
        </div>

      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { currentTheme } = useTheme();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const handleOpenLatest = () => {
      if (posts.length > 0) {
          setSelectedPost(posts[0]);
      }
  };

  return (
    <div className={`min-h-screen w-full ${currentTheme.colors.background} p-4 sm:p-8 relative overflow-hidden ${currentTheme.colors.selection} transition-colors duration-700 ease-in-out`}>
      
      {/* Background Orbs for atmosphere */}
      <div className={`fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] ${currentTheme.colors.orb1} rounded-full blur-[100px] pointer-events-none transition-colors duration-700`} />
      <div className={`fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] ${currentTheme.colors.orb2} rounded-full blur-[100px] pointer-events-none transition-colors duration-700`} />
      
      {/* Seasonal Particle Effects */}
      <SeasonalEffects />

      {/* The Physics Drop */}
      <WaterDrop />

      {/* Article Modal */}
      <ArticleModal post={selectedPost} onClose={() => setSelectedPost(null)} />

      <div className="max-w-7xl mx-auto h-full relative z-10">
        
        {/* Floating Header Actions */}
        <div className="absolute top-0 right-0 p-4 flex gap-3 z-20">
            <button className={`hidden lg:flex ${currentTheme.colors.accentBg} px-4 py-2 rounded-xl items-center gap-2 shadow-lg ${currentTheme.colors.shadow} hover:-translate-y-1 transition-transform`}>
                <PenTool size={16} />
                <span className="font-bold text-sm">Write</span>
            </button>
            <ThemeSwitcher />
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-4rem)] pt-16 lg:pt-0">
            
            {/* Left Column: Sidebar (3 cols) */}
            <div className="lg:col-span-3 h-full">
                <Sidebar onOpenArticle={handleOpenLatest} />
            </div>

            {/* Middle Column: Hero & Misc (6 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="h-[200px] lg:h-1/3 w-full">
                   {/* Top Image Card - Simulated via GlassCard with custom Image */}
                   <div className={`w-full h-full rounded-[2rem] overflow-hidden relative shadow-sm border ${currentTheme.colors.cardBorder}`}>
                        <img src="https://picsum.photos/800/400?random=10" className="w-full h-full object-cover" alt="Banner" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                   </div>
                </div>
                
                <div className="flex-1">
                    <ProfileHero />
                </div>
                
                <div className="h-auto lg:h-[140px] grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <NewArticle onClick={handleOpenLatest} />
                   <div className="grid grid-cols-3 gap-3">
                       <div className="col-span-2"><GithubWidget /></div>
                       <div className="col-span-1"><MailWidget /></div>
                   </div>
                </div>
            </div>

            {/* Right Column: Widgets (3 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <div>
                   <ClockWidget />
                </div>
                
                <div className="flex-1">
                    <CalendarWidget />
                </div>

                <div className="flex flex-col gap-4">
                     <div className="flex gap-4 h-[60px]">
                        <div className="flex-1">
                            <JuejinWidget />
                        </div>
                     </div>
                     <MusicPlayer />
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default App;