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
          className={`glass-vibrant px-6 py-2.5 rounded-full shadow-2xl flex items-center gap-4 hover:scale-105 transition-all cursor-pointer group`} 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-brand-indigo to-brand-cyan rounded-full flex items-center justify-center text-white font-black text-[10px] shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">MF</div>
          <span className={`text-xl font-display font-extrabold tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Med<span className="gradient-text">-fast</span>
          </span>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onToggleTheme}
            className={`glass-vibrant p-3 rounded-full flex items-center justify-center transition-all hover:scale-110`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0V3a1 1 0 102 0v2zm4 2a1 1 0 00-1 1v1a1 1 0 102 0V8a1 1 0 00-1-1zm3 3a1 1 0 100-2h-2a1 1 0 100 2h2zm-3 4a1 1 0 11-1-1 1 1 0 011 1zm-5 3a1 1 0 10-2 0v2a1 1 0 102 0v-2zm-4-2a1 1 0 11-1 1 1 1 0 011-1zm-3-3a1 1 0 100-2h2a1 1 0 100 2H3z" clipRule="evenodd"/></svg>
            ) : (
              <svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
            )}
          </button>
          
          <div className="hidden sm:flex glass-vibrant px-6 py-2.5 rounded-full items-center gap-4">
            <div className="flex gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-brand-rose animate-pulse"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-brand-indigo animate-pulse" style={{animationDelay: '0.2s'}}></div>
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Core Hub</span>
          </div>
        </div>
      </div>
    </nav>
  );
};