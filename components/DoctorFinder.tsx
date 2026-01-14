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
      // The findDoctors service now returns mock data.
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

  // Function to generate a placeholder phone number for display
  const generatePhoneNumber = (index: number) => {
    // Simple way to ensure variety in mock numbers
    const lastFive = String(10000 + (index * 7 % 90000)).padStart(5, '0');
    return `+91-98765-${lastFive}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      <div className={`glass-vibrant rounded-[3rem] p-10 md:p-14 border-l-8 border-l-brand-cyan`}>
        <form onSubmit={handleSearch} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label htmlFor="problem-input" className={`text-[10px] font-black uppercase tracking-widest pl-2 ${theme === 'dark' ? 'text-brand-cyan' : 'text-slate-400'}`}>Specialist Need</label>
              <input
                id="problem-input"
                type="text"
                placeholder="e.g. Skin Specialist..."
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
            className={`w-full py-6 rounded-[2.5rem] text-2xl font-black text-white shadow-xl transition-all disabled:opacity-50 active:scale-95 bg-gradient-to-r from-brand-rose via-brand-indigo to-brand-cyan`}
            aria-label="Find instant care"
          >
            {loading ? <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div> : "FIND INSTANT CARE"}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* Location Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-8 glass-vibrant rounded-[2.5rem] border-l-8 border-l-brand-rose">
            <div>
              <div className={`text-[10px] font-black uppercase tracking-[0.4em] ${theme === 'dark' ? 'text-brand-rose' : 'text-slate-400'}`}>Showing results for</div>
              <h2 className={`text-3xl font-display font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{activeLocation}</h2>
            </div>
            <div className={`text-right hidden md:block ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
               <div className="text-[10px] font-black uppercase tracking-widest">Powered by</div>
               <div className="text-xl font-display font-black gradient-text">Med-fast AI</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {result.chunks.map((chunk: any, idx: number) => {
              const data = chunk.maps || chunk.web;
              if (!data) return null;
              const isHovered = hoveredIdx === idx;
              const phoneNumber = generatePhoneNumber(idx); // Generate phone number for this card
              
              return (
                <div 
                  key={idx}
                  className="relative group"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <div 
                    className={`glass-vibrant block rounded-[2.5rem] overflow-hidden transition-all duration-500 relative z-10 ${theme === 'dark' ? 'hover:border-brand-indigo/50' : 'hover:border-brand-indigo/30 shadow-lg'}`}
                    role="article"
                    aria-label={`Details for ${data.title}`}
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img src={getImageUrl(idx)} alt={data.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-6">
                        <a 
                          href={data.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-brand-indigo text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg hover:bg-brand-indigo/80 active:scale-95 transition-all"
                          aria-label={`Open map for ${data.title}`}
                        >
                          Open Map
                        </a>
                      </div>
                    </div>

                    <div className="p-8">
                      <h4 className={`text-xl font-bold mb-3 leading-tight transition-all ${theme === 'dark' ? 'text-white' : 'text-slate-900 group-hover:text-brand-indigo'}`}>
                        {data.title} {/* This is the "full address" from the mock data */}
                      </h4>
                      <div className={`flex items-center gap-3 mb-6 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                         <svg className="w-5 h-5 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                         <a 
                           href={`tel:${phoneNumber}`} 
                           className={`font-medium text-lg hover:text-brand-cyan transition-colors`}
                           aria-label={`Call ${data.title} at ${phoneNumber}`}
                         >
                           {phoneNumber}
                         </a>
                      </div>
                      
                      <div className="text-[10px] font-black text-brand-cyan uppercase tracking-widest flex items-center gap-2">
                        <span>VIEW MORE DETAILS</span>
                        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </div>
                  </div>

                  {isHovered && (
                    <div className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-300">
                      <div className={`w-full h-full backdrop-blur-3xl rounded-[2.5rem] p-8 border-2 border-brand-indigo flex flex-col justify-center gap-6 shadow-[0_0_50px_rgba(99,102,241,0.2)] ${theme === 'dark' ? 'bg-[#0a0f1e]/90' : 'bg-white/95'}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(s => (
                              <span key={s} className="text-brand-rose text-lg" aria-hidden="true">★</span>
                            ))}
                          </div>
                          <span className={`text-[10px] font-black uppercase ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>Top Rated Facility</span>
                        </div>
                        <div className="space-y-4">
                          <h5 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{data.title}</h5>
                          <p className={`text-sm font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                            Specialized care for {problem}. Recognized as a premier hub with modern equipment.
                          </p>
                          <div className={`flex items-center gap-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                             <svg className="w-5 h-5 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                             <span className={`font-bold text-lg`}>{phoneNumber}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-brand-indigo/20 text-brand-indigo text-[9px] font-black px-3 py-1 rounded-full uppercase">Top Choice</span>
                            <span className="bg-brand-cyan/20 text-brand-cyan text-[9px] font-black px-3 py-1 rounded-full uppercase">Verified</span>
                          </div>
                        </div>
                        <div className="pt-6 border-t border-white/10 text-center">
                            <a href={`tel:${phoneNumber}`} className="text-[11px] font-black text-brand-rose uppercase tracking-[0.3em] animate-pulse cursor-pointer" aria-label={`Call ${data.title} now`}>CALL NOW</a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={`glass-vibrant p-12 rounded-[3.5rem] prose max-w-none border-t-8 border-t-brand-indigo shadow-2xl ${theme === 'dark' ? 'prose-invert' : 'prose-indigo prose-lg'}`}>
            <h2 className="text-3xl font-display font-black m-0 mb-8 flex items-center gap-4">
               <span className="w-12 h-12 bg-gradient-to-tr from-brand-rose via-brand-indigo to-brand-cyan rounded-2xl flex items-center justify-center text-white text-base font-black shadow-lg">AI</span>
               Detailed Narrative Care Plan
            </h2>
            <ReactMarkdown>{result.text}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};