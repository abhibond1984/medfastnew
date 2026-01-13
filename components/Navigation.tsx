import React from 'react';
import { AppMode } from '../types';

interface NavigationProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentMode, onModeChange }) => {
  return (
    <nav className="glass sticky top-0 z-50 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Minimal Logo for Header */}
          <div className="flex items-center cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 relative mr-2">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M6 3V6C6 8.20914 7.79086 10 10 10C12.2091 10 14 8.20914 14 6V3" stroke="#334155" strokeWidth="2" strokeLinecap="round"/>
                 <path d="M10 10V14C10 16.2091 11.7909 18 14 18H15" stroke="#334155" strokeWidth="2" strokeLinecap="round"/>
                 <circle cx="18" cy="18" r="3" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
                 <circle cx="18" cy="18" r="1" fill="#0ea5e9"/>
              </svg>
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              MED<span className="text-neon-blue drop-shadow-sm">-FAST</span>
            </span>
          </div>

          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest hidden sm:block">
            AI Healthcare Companion
          </div>

        </div>
      </div>
    </nav>
  );
};