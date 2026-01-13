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

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      <div className={`glass-vibrant rounded-[3rem] p-10 md:p-14 border-l-8 border-l-brand-cyan`}>
        <form onSubmit={handleSearch} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className={`text-[10px] font-black uppercase tracking-widest pl-2 ${theme === 'dark' ? 'text-brand-cyan' : 'text-slate-400'}`}>Goal / Specialist</label>
              <input
                type="text"
                placeholder="e.g. Cardiologist..."
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className={`w-full border rounded-2xl px-6 py-5 text-xl outline-none transition-all shadow-inner ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-brand-indigo' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-indigo'}`}
              />
            </div>
            <div className="space-y-4">
              <label className={`text-[10px] font-black uppercase tracking-widest pl-2 ${theme === 'dark' ? 'text-brand-indigo' : 'text-slate-400'}`}>Target Area</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ranchi..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full border rounded-2xl pl-6 pr-14 py-5 text-xl outline-none transition-all shadow-inner ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-brand-cyan' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-cyan'}`}
                />
                <button
                  type="button"
                  onClick={() => fetchLocation()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 text-brand-cyan hover:bg-brand-cyan/10 rounded-xl transition-all"
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
            className={`w-full py-6 rounded-[2.5rem] text-2xl font-black text-white shadow-xl transition-all disabled:opacity-50 active:scale-95 bg-gradient-to-r from-brand-indigo to-brand-cyan`}
          >
            {loading ? <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div> : "SEARCH MED-FAST"}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {result.chunks.map((chunk: any, idx: number) => {
              const data = chunk.maps || chunk.web;
              if (!data) return null;
              const isHovered = hoveredIdx === idx;
              
              return (
                <div 
                  key={idx}
                  className="relative group"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <a
                    href={data.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`glass-vibrant block rounded-[2.5rem] overflow-hidden transition-all duration-500 relative z-10 ${theme === 'dark' ? 'hover:border-brand-indigo/50' : 'hover:border-brand-indigo/30 shadow-lg'}`}
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img src={getImageUrl(idx)} alt={data.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-6">
                        <span className="bg-brand-indigo text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Open Map</span>
                      </div>
                    </div>

                    <div className="p-8">
                      <h4 className={`text-xl font-bold mb-2 line-clamp-2 leading-tight transition-all ${theme === 'dark' ? 'text-white' : 'text-slate-900 group-hover:text-brand-indigo'}`}>
                        {data.title}
                      </h4>
                      <div className="text-[10px] font-black text-brand-cyan uppercase tracking-widest flex items-center gap-2">
                        <span>Details</span>
                        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </div>
                  </a>

                  {isHovered && (
                    <div className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-300">
                      <div className={`w-full h-full backdrop-blur-3xl rounded-[2.5rem] p-8 border-2 border-brand-indigo flex flex-col justify-center gap-6 shadow-[0_0_50px_rgba(99,102,241,0.2)] ${theme === 'dark' ? 'bg-[#0a0f1e]/90' : 'bg-white/95'}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(s => (
                              <span key={s} className="text-brand-rose text-lg">★</span>
                            ))}
                          </div>
                          <span className={`text-[10px] font-black uppercase ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>Rating</span>
                        </div>
                        <div className="space-y-4">
                          <p className={`text-sm font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                            Specialized care for {problem}. Recognized as a premier hub with modern equipment.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-brand-indigo/20 text-brand-indigo text-[9px] font-black px-3 py-1 rounded-full uppercase">Top Choice</span>
                            <span className="bg-brand-cyan/20 text-brand-cyan text-[9px] font-black px-3 py-1 rounded-full uppercase">Verified</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={`glass-vibrant p-12 rounded-[3.5rem] prose max-w-none border-t-8 border-t-brand-indigo ${theme === 'dark' ? 'prose-invert' : 'prose-indigo prose-lg'}`}>
            <h2 className="text-3xl font-display font-extrabold m-0 mb-8 flex items-center gap-4">
               <span className="w-12 h-12 bg-brand-indigo rounded-2xl flex items-center justify-center text-white text-base">AI</span>
               Narrative Insight
            </h2>
            <ReactMarkdown>{result.text}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};