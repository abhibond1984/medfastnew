import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { DoctorFinder } from './components/DoctorFinder';
import { PrescriptionAnalyzer } from './components/PrescriptionAnalyzer';
import { LocalDirectory } from './components/LocalDirectory';
import { AppMode } from './types';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.FIND_DOCTOR);

  // Calculate position of the sliding pill based on active mode
  const getPillStyle = () => {
    switch(mode) {
        case AppMode.FIND_DOCTOR:
            return { left: '4px', width: 'calc(33.33% - 6px)' };
        case AppMode.ANALYZE_PRESCRIPTION:
            return { left: 'calc(33.33% + 2px)', width: 'calc(33.33% - 6px)' };
        case AppMode.LOCAL_DIRECTORY:
            return { left: 'calc(66.66% + 0px)', width: 'calc(33.33% - 4px)' };
        default:
            return { left: '4px', width: 'calc(33.33% - 6px)' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      <Navigation currentMode={mode} onModeChange={setMode} />
      
      <main className="flex-grow">
        {/* Modern Hero Section with Vibrant Aesthetics */}
        <div className="relative bg-white pb-10 pt-10 lg:pt-16 overflow-hidden">
           
           {/* Vibrant Background Blobs */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-neon-purple rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-float"></div>
              <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] bg-neon-blue rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
              <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-neon-pink rounded-full mix-blend-multiply filter blur-[130px] opacity-15 animate-float" style={{animationDelay: '4s'}}></div>
           </div>

           <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center z-10">
              
              {/* Giant Animated Logo */}
              <div className="mb-6 relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
                 <svg className="w-full h-full dance-icon drop-shadow-2xl" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Stethoscope Background */}
                    <path d="M20 20V30C20 45 30 55 50 55C70 55 80 45 80 30V20" stroke="#1e293b" strokeWidth="6" strokeLinecap="round"/>
                    <path d="M50 55V75C50 85 60 90 70 90H75" stroke="#1e293b" strokeWidth="6" strokeLinecap="round"/>
                    <circle cx="85" cy="90" r="8" fill="#f1f5f9" stroke="#1e293b" strokeWidth="4"/>
                    
                    {/* Large 2-Color Pill - Dancing */}
                    <g transform="translate(50, 40)"> 
                       <g transform="rotate(-30)">
                          {/* Bottom Half - Neon Pink */}
                          <path d="M-15 0H15V15C15 23.2843 8.28427 30 0 30C-8.28427 30 -15 23.2843 -15 15V0Z" fill="#ff00ff"/>
                          {/* Top Half - Neon Green */}
                          <path d="M-15 0H15V-15C15 -23.2843 8.28427 -30 0 -30C-8.28427 -30 -15 -23.2843 -15 -15V0Z" fill="#ccff00"/>
                          {/* Shine/Reflection */}
                          <path d="M-8 -20C-8 -24 -5 -26 0 -26" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
                       </g>
                    </g>
                 </svg>
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-2 drop-shadow-sm">
                MED<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">-FAST</span>
              </h1>
              <p className="text-lg md:text-2xl font-medium text-slate-600 max-w-2xl mx-auto mb-10">
                Connect with Care, Decode Your Cure.
              </p>

              {/* Central Navigation Toggle Bar */}
              <div className="w-full max-w-2xl mx-auto">
                 <div className="relative flex bg-white/50 backdrop-blur-sm p-2 rounded-full border border-white/60 shadow-lg ring-1 ring-slate-900/5 w-full">
                    {/* Sliding Background Pill */}
                    <div 
                      className="absolute top-2 bottom-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg transition-all duration-300 ease-out z-0"
                      style={getPillStyle()}
                    />

                    {/* Nav Items */}
                    <button
                      onClick={() => setMode(AppMode.FIND_DOCTOR)}
                      className={`relative z-10 flex-1 py-3 sm:py-4 rounded-full text-sm sm:text-base font-bold transition-colors duration-300 flex flex-col sm:flex-row items-center justify-center gap-2 ${
                        mode === AppMode.FIND_DOCTOR ? 'text-white' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <svg className={`w-5 h-5 ${mode === AppMode.FIND_DOCTOR ? 'text-neon-blue' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>Find Doctors</span>
                    </button>

                    <button
                      onClick={() => setMode(AppMode.ANALYZE_PRESCRIPTION)}
                      className={`relative z-10 flex-1 py-3 sm:py-4 rounded-full text-sm sm:text-base font-bold transition-colors duration-300 flex flex-col sm:flex-row items-center justify-center gap-2 ${
                        mode === AppMode.ANALYZE_PRESCRIPTION ? 'text-white' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <svg className={`w-5 h-5 ${mode === AppMode.ANALYZE_PRESCRIPTION ? 'text-neon-green' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Analyze Rx</span>
                    </button>

                    <button
                      onClick={() => setMode(AppMode.LOCAL_DIRECTORY)}
                      className={`relative z-10 flex-1 py-3 sm:py-4 rounded-full text-sm sm:text-base font-bold transition-colors duration-300 flex flex-col sm:flex-row items-center justify-center gap-2 ${
                        mode === AppMode.LOCAL_DIRECTORY ? 'text-white' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <svg className={`w-5 h-5 ${mode === AppMode.LOCAL_DIRECTORY ? 'text-neon-pink' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>Local Dir</span>
                    </button>
                 </div>
              </div>
           </div>
        </div>

        <div className="relative z-10 pb-20">
          <div className="max-w-7xl mx-auto px-2">
            {mode === AppMode.FIND_DOCTOR && <DoctorFinder />}
            {mode === AppMode.ANALYZE_PRESCRIPTION && <PrescriptionAnalyzer />}
            {mode === AppMode.LOCAL_DIRECTORY && <LocalDirectory />}
          </div>
        </div>
      </main>

      <footer className="bg-white/50 backdrop-blur-md border-t border-slate-100 py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-900">MED<span className="text-neon-blue">-FAST</span></span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <p className="text-xs text-slate-400 max-w-md text-center md:text-right">
            Disclaimer: This tool provides information based on AI analysis and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a physician.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;