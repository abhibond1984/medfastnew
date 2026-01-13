import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { DoctorFinder } from './components/DoctorFinder';
import { PrescriptionAnalyzer } from './components/PrescriptionAnalyzer';
import { LocalDirectory } from './components/LocalDirectory';
import { AppMode } from './types';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.FIND_DOCTOR);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.body.className = `font-sans antialiased ${theme}`;
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0a0f1e]' : 'bg-[#f8f9ff]'}`}>
      {/* Animated Vibrant Background Blobs */}
      <div className="blob-vibrant bg-brand-indigo w-[600px] h-[600px] top-[-200px] left-[-100px] animate-morph"></div>
      <div className="blob-vibrant bg-brand-cyan w-[500px] h-[500px] bottom-[-100px] right-[-100px] animate-morph" style={{ animationDelay: '2s' }}></div>
      <div className="blob-vibrant bg-brand-rose w-[400px] h-[400px] top-[20%] right-[10%] animate-morph" style={{ animationDelay: '4s' }}></div>

      <Navigation currentMode={mode} onModeChange={setMode} theme={theme} onToggleTheme={toggleTheme} />
      
      <main className="flex-grow z-10 pt-24 pb-12 px-6 no-print">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-12">
          
          {/* Logo */}
          <div className="mb-6 relative group animate-float">
            <div className={`absolute inset-0 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity ${theme === 'dark' ? 'bg-brand-indigo' : 'bg-brand-cyan'}`}></div>
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative drop-shadow-2xl">
              <path d="M20 30V45C20 61.5685 33.4315 75 50 75C66.5685 75 80 61.5685 80 45V30" stroke={theme === 'dark' ? 'white' : '#1e293b'} strokeWidth="4" strokeLinecap="round"/>
              <path d="M50 75V85C50 90.5228 54.4772 95 60 95H70" stroke={theme === 'dark' ? 'white' : '#1e293b'} strokeWidth="4" strokeLinecap="round"/>
              <circle cx="78" cy="95" r="5" fill="#f43f5e" />
              <path d="M20 25V30" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round"/>
              <path d="M80 25V30" stroke="#6366f1" strokeWidth="6" strokeLinecap="round"/>
              <rect x="42" y="15" width="16" height="36" rx="8" fill="#06b6d4" />
              <rect x="42" y="33" width="16" height="18" rx="8" fill="#6366f1" />
            </svg>
          </div>

          <h1 className="text-6xl md:text-8xl font-display font-extrabold tracking-tighter mb-2 animate-in fade-in zoom-in duration-1000">
            <span className="gradient-text">Med-fast</span>
          </h1>
          
          <p className={`text-lg md:text-xl font-display font-medium tracking-tight mb-10 max-w-lg ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Healthcare at the speed of life.
          </p>

          {/* Mode Switcher */}
          <div className={`flex backdrop-blur-3xl p-1.5 rounded-full border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-200/50 border-slate-300'}`}>
            {[
              { id: AppMode.FIND_DOCTOR, label: 'Search', icon: '🔍' },
              { id: AppMode.ANALYZE_PRESCRIPTION, label: 'Report', icon: '🧾' },
              { id: AppMode.LOCAL_DIRECTORY, label: 'Directory', icon: '📍' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setMode(item.id)}
                className={`relative px-6 md:px-10 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 group ${
                  mode === item.id 
                  ? 'bg-brand-indigo text-white shadow-lg' 
                  : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto pb-24">
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {mode === AppMode.FIND_DOCTOR && <DoctorFinder theme={theme} />}
            {mode === AppMode.ANALYZE_PRESCRIPTION && <PrescriptionAnalyzer theme={theme} />}
            {mode === AppMode.LOCAL_DIRECTORY && <LocalDirectory theme={theme} />}
          </div>
        </div>
      </main>

      <footer className={`py-12 no-print border-t transition-colors ${theme === 'dark' ? 'border-white/5 bg-black/20' : 'border-slate-200 bg-white/50'}`}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <div className="text-2xl font-display font-bold gradient-text mb-1">Med-fast</div>
            <p className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'} text-[10px] font-black tracking-widest uppercase`}>Instant Care Access • 2026</p>
          </div>
          <div className="flex gap-10">
            <div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Ranchi</div>
              <div className="text-[10px] text-brand-indigo font-black uppercase tracking-widest">Active Hub</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>AI Core</div>
              <div className="text-[10px] text-brand-cyan font-black uppercase tracking-widest">Powered</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;