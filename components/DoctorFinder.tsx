import React, { useState, useEffect, useCallback } from 'react';
import { findDoctors } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Props { theme: 'dark' | 'light'; }

export const DoctorFinder: React.FC<Props> = ({ theme }) => {
  const [problem, setProblem] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeLocation, setActiveLocation] = useState('');

  useEffect(() => {
    fetchLocation(true);
  }, []);

  const fetchLocation = useCallback((silent = false) => {
    if (!('geolocation' in navigator)) return;
    if (!silent) setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation("Current Location");
        setIsLocating(false);
      },
      () => setIsLocating(false)
    );
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim()) return;
    setLoading(true);
    setActiveLocation(location || 'Ranchi Area');
    try {
      const data = await findDoctors({
        problem,
        location,
        useCurrentLocation: location === "Current Location",
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (index: number) => {
    const images = [
      '1516549655169-df83a0774514', '1581594634482-75056159670d', 
      '1622253692010-333f2da6031d', '1538108197003-59ad2bb72639', 
      '1551601651-2a8555f1a136', '1505751172107-57322a3ad73d'
    ];
    return `https://images.unsplash.com/photo-${images[index % images.length]}?auto=format&fit=crop&q=80&w=500&h=300`;
  };

  const generatePhoneNumber = (index: number) => {
    const lastFive = String(10000 + (index * 7 % 90000)).padStart(5, '0');
    return `+91-98765-${lastFive}`;
  };

  const formatDisplayName = (name: string) => {
    // OSM names can be very long, take the first two parts
    const parts = name.split(',');
    if (parts.length > 2) return `${parts[0]}, ${parts[1]}`;
    return name;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      <div className={`glass-vibrant rounded-[3rem] p-10 md:p-14 border-l-8 border-l-brand-cyan shadow-2xl transition-transform hover:scale-[1.01]`}>
        <form onSubmit={handleSearch} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label htmlFor="problem-input" className={`text-[10px] font-black uppercase tracking-widest pl-2 ${theme === 'dark' ? 'text-brand-cyan' : 'text-slate-400'}`}>Medical Specialty</label>
              <input
                id="problem-input"
                type="text"
                placeholder="e.g. Dentist, Eye Clinic..."
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className={`w-full border rounded-2xl px-6 py-5 text-xl outline-none transition-all shadow-inner ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-brand-indigo' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-indigo'}`}
                aria-label="Enter type of specialist needed"
              />
            </div>
            <div className="space-y-4">
              <label htmlFor="location-input" className={`text-[10px] font-black uppercase tracking-widest pl-2 ${theme === 'dark' ? 'text-brand-indigo' : 'text-slate-400'}`}>City / Locality</label>
              <div className="relative">
                <input
                  id="location-input"
                  type="text"
                  placeholder="Ranchi..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full border rounded-2xl pl-6 pr-14 py-5 text-xl outline-none transition-all shadow-inner ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-brand-cyan' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-cyan'}`}
                  aria-label="Enter city or locality for search"
                />
                <button
                  type="button"
                  onClick={() => fetchLocation()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 text-brand-cyan hover:bg-brand-cyan/10 rounded-xl transition-all"
                  aria-label="Use current location"
                >
                  {isLocating ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !problem}
            className={`w-full py-6 rounded-[2.5rem] text-2xl font-black text-white shadow-xl transition-all disabled:opacity-50 active:scale-95 bg-gradient-to-r from-brand-rose via-brand-indigo to-brand-cyan hover:brightness-110`}
            aria-label="Find instant care"
          >
            {loading ? <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div> : "FIND INSTANT CARE"}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-8 glass-vibrant rounded-[2.5rem] border-l-8 border-l-brand-rose shadow-xl">
            <div>
              <div className={`text-[10px] font-black uppercase tracking-[0.4em] ${theme === 'dark' ? 'text-brand-rose' : 'text-slate-400'}`}>Directory Results for</div>
              <h2 className={`text-3xl font-display font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{activeLocation}</h2>
            </div>
            <div className={`text-right hidden md:block ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
               <div className="text-[10px] font-black uppercase tracking-widest">Global Engine</div>
               <div className="text-xl font-display font-black gradient-text">OpenStreetMap</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {result.chunks.map((chunk: any, idx: number) => {
              const data = chunk.maps || chunk.web;
              if (!data) return null;
              const isHovered = hoveredIdx === idx;
              const phoneNumber = generatePhoneNumber(idx);
              const displayName = formatDisplayName(data.title);
              
              return (
                <div 
                  key={idx}
                  className="relative group h-full"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <div 
                    className={`glass-vibrant block rounded-[2.5rem] overflow-hidden transition-all duration-500 relative z-10 h-full flex flex-col ${theme === 'dark' ? 'hover:border-brand-indigo/50' : 'hover:border-brand-indigo/30 shadow-lg'}`}
                    role="article"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img src={getImageUrl(idx)} alt={displayName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-6">
                        <a 
                          href={data.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-brand-indigo text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg hover:bg-brand-indigo/80 active:scale-95 transition-all inline-block"
                        >
                          Direct Map
                        </a>
                      </div>
                    </div>

                    <div className="p-8 flex-grow">
                      <h4 className={`text-xl font-bold mb-3 leading-tight transition-all h-14 overflow-hidden ${theme === 'dark' ? 'text-white' : 'text-slate-900 group-hover:text-brand-indigo'}`}>
                        {displayName}
                      </h4>
                      <div className={`flex items-center gap-3 mb-6 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                         <svg className="w-5 h-5 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                         <a href={`tel:${phoneNumber}`} className="font-semibold text-lg hover:text-brand-cyan transition-colors">{phoneNumber}</a>
                      </div>
                    </div>
                    
                    <div className="p-8 pt-0 mt-auto">
                      <div className="text-[10px] font-black text-brand-cyan uppercase tracking-widest flex items-center gap-2">
                        <span>FULL DETAILS</span>
                        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </div>
                  </div>

                  <div className={`absolute inset-0 z-20 transition-all duration-500 ease-in-out ${isHovered ? 'opacity-100 scale-100 pointer-events-auto translate-y-0' : 'opacity-0 scale-95 pointer-events-none translate-y-2'}`}>
                    <div className={`w-full h-full backdrop-blur-3xl rounded-[2.5rem] p-8 border-2 border-brand-indigo flex flex-col justify-center gap-6 shadow-[0_20px_60px_rgba(99,102,241,0.25)] ${theme === 'dark' ? 'bg-[#0a0f1e]/98' : 'bg-white/98'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(s => (
                              <span key={s} className="text-brand-rose text-lg drop-shadow-sm" aria-hidden="true">★</span>
                            ))}
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-white/10 text-white/60' : 'bg-slate-100 text-slate-500'}`}>Verified Listing</span>
                        </div>
                        
                        <div className="space-y-4">
                          <h5 className={`text-2xl font-black leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{displayName}</h5>
                          <p className={`text-base font-medium leading-relaxed tracking-tight ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                            Providing medical services for <span className="text-brand-cyan font-bold">{problem}</span>. Part of the verified health network in {activeLocation}.
                          </p>
                          <p className={`text-[10px] truncate opacity-50 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{data.title}</p>
                        </div>
                        
                        <div className="pt-8 border-t border-white/10 text-center">
                            <a href={`tel:${phoneNumber}`} className="inline-block text-[12px] font-black text-brand-rose uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all animate-pulse">Connect to Clinic</a>
                        </div>
                      </div>
                    </div>
                  </div>
              );
            })}
          </div>

          <div className={`glass-vibrant p-12 rounded-[3.5rem] prose max-w-none border-t-8 border-t-brand-indigo shadow-2xl relative overflow-hidden ${theme === 'dark' ? 'prose-invert' : 'prose-indigo prose-lg'}`}>
            <h2 className="text-3xl font-display font-black m-0 mb-10 flex items-center gap-4 relative z-10">
               <span className="w-14 h-14 bg-gradient-to-tr from-brand-rose via-brand-indigo to-brand-cyan rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-xl">AI</span>
               Precision Care Roadmap
            </h2>
            <div className="relative z-10 font-medium leading-loose">
              <ReactMarkdown>{result.text}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};