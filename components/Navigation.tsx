import React from 'react';
import { AppMode } from '../types';

interface NavigationProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ theme, onToggleTheme }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] p-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
        <div 
          className={`glass-vibrant px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 hover:scale-105 transition-all cursor-pointer group`} 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-brand-rose via-brand-indigo to-brand-cyan rounded-full flex items-center justify-center text-white font-black text-[12px] shadow-lg shadow-indigo-500/30 group-hover:rotate-[360deg] transition-transform duration-1000">MF</div>
          <span className={`text-2xl font-display font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            <span className="bg-gradient-to-r from-brand-rose via-brand-indigo to-brand-cyan bg-clip-text text-transparent">Med</span>
            <span className={`${theme === 'dark' ? 'text-white/80' : 'text-slate-600'}`}>-fast</span>
          </span>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onToggleTheme}
            className={`glass-vibrant p-4 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-xl`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg className="w-6 h-6 text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.6)]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0V3a1 1 0 102 0v2zm4 2a1 1 0 00-1 1v1a1 1 0 102 0V8a1 1 0 00-1-1zm3 3a1 1 0 100-2h-2a1 1 0 100 2h2zm-3 4a1 1 0 11-1-1 1 1 0 011 1zm-5 3a1 1 0 10-2 0v2a1 1 0 102 0v-2zm-4-2a1 1 0 11-1 1 1 1 0 011-1zm-3-3a1 1 0 100-2h2a1 1 0 100 2H3z" clipRule="evenodd"/></svg>
            ) : (
              <svg className="w-6 h-6 text-slate-700" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};