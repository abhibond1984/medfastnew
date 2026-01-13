import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { DoctorFinder } from './components/DoctorFinder';
import { PrescriptionAnalyzer } from './components/PrescriptionAnalyzer';
import { LocalDirectory } from './components/LocalDirectory';
import { AppMode } from './types';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.FIND_DOCTOR);

  const getPillPosition = () => {
    switch(mode) {
      case AppMode.FIND_DOCTOR: return '0%';
      case AppMode.ANALYZE_PRESCRIPTION: return '33.33%';
      case AppMode.LOCAL_DIRECTORY: return '66.66%';
      default: return '0%';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      <Navigation />
      
      <main className="flex-grow">
        {/* Modern Hero Section */}
        <div className="relative bg-white pb-12 pt-12 lg:pt-20 overflow-hidden print:hidden">
           {/* Ambient Background */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
              <div className="absolute top-[-5%] left-[-5%] w-[400px] h-[400px] bg-neon-blue rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-float"></div>
              <div className="absolute bottom-0 right-[5%] w-[400px] h-[400px] bg-neon-pink rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-float" style={{animationDelay: '3s'}}></div>
           </div>

           <div className="relative max-w-5xl mx-auto px-4 text-center flex flex-col items-center z-10">
              
              {/* Large Hero Logo */}
              <div className="mb-8 relative group">
                 <div className="absolute inset-0 bg-neon-pink/20 blur-3xl rounded-full scale-150 group-hover:bg-neon-blue/20 transition-colors duration-700"></div>
                 <svg className="w-48 h-48 sm:w-56 sm:h-56 relative z-10 drop-shadow-2xl" viewBox="0 0 100 100" fill="none">
                    <path d="M30 40C30 25 40 20 50 20C60 20 70 25 70 40V50C70 65 60 70 50 70C40 70 30 65 30 50V40Z" fill="white" stroke="#1e293b" strokeWidth="2"/>
                    {/* The 2-Tone Pill */}
                    <g className="animate-dance" style={{ transformOrigin: '50px 45px' }}>
                       <path d="M40 30V45H60V30C60 24.4772 55.5228 20 50 20C44.4772 20 40 24.4772 40 30Z" fill="#ccff00"/>
                       <path d="M40 45V60C40 65.5228 44.4772 70 50 70C55.5228 70 60 65.5228 60 60V45H40Z" fill="#f472b6"/>
                       <path d="M45 28C45 26 47 25 50 25" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                    </g>
                    {/* Stethoscope logic */}
                    <path d="M25 30V40C25 55 35 65 50 65C65 65 75 55 75 40V30" stroke="#1e293b" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M50 65V85C50 90 55 92 60 92H65" stroke="#1e293b" strokeWidth="4" strokeLinecap="round"/>
                    <circle cx="72" cy="92" r="6" fill="#f1f5f9" stroke="#1e293b" strokeWidth="3"/>
                 </svg>
              </div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-2">
                MED<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">-FAST</span>
              </h1>
              <p className="text-xl md:text-3xl font-bold text-slate-400 max-w-2xl mx-auto mb-12">
                Your AI Healthcare Companion. <span className="text-neon-pink">Ranchi 2026 Edition.</span>
              </p>

              {/* Central Nav Bar */}
              <div className="w-full max-w-2xl mx-auto">
                 <div className="relative flex bg-slate-100 rounded-full p-1.5 shadow-inner border border-slate-200">
                    <div 
                      className="absolute top-1.5 bottom-1.5 rounded-full bg-white shadow-md transition-all duration-500 ease-in-out"
                      style={{ left: `calc(${getPillPosition()} + 6px)`, width: 'calc(33.33% - 12px)' }}
                    ></div>

                    <button onClick={() => setMode(AppMode.FIND_DOCTOR)} className={`relative z-10 flex-1 py-4 text-sm font-black transition-colors ${mode === AppMode.FIND_DOCTOR ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
                      FIND DOCTORS
                    </button>
                    <button onClick={() => setMode(AppMode.ANALYZE_PRESCRIPTION)} className={`relative z-10 flex-1 py-4 text-sm font-black transition-colors ${mode === AppMode.ANALYZE_PRESCRIPTION ? 'text-neon-green-dark' : 'text-slate-400 hover:text-slate-600'}`}>
                      ANALYZE RX
                    </button>
                    <button onClick={() => setMode(AppMode.LOCAL_DIRECTORY)} className={`relative z-10 flex-1 py-4 text-sm font-black transition-colors ${mode === AppMode.LOCAL_DIRECTORY ? 'text-neon-pink' : 'text-slate-400 hover:text-slate-600'}`}>
                      LOCAL DIR
                    </button>
                 </div>
              </div>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-20">
          {mode === AppMode.FIND_DOCTOR && <DoctorFinder />}
          {mode === AppMode.ANALYZE_PRESCRIPTION && <PrescriptionAnalyzer />}
          {mode === AppMode.LOCAL_DIRECTORY && <LocalDirectory />}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 py-12 mt-auto print:hidden">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-2xl font-black text-slate-900 mb-4">MED<span className="text-neon-blue">-FAST</span></div>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-6 font-medium">
            Deploy this static app to GitHub Pages for free. Powered by advanced Gemini AI vision and Google Search grounding.
          </p>
          <div className="flex justify-center gap-6 text-xs font-bold text-slate-300 uppercase tracking-widest">
            <span>&copy; 2026 Ranchi Health</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;