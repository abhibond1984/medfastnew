import React, { useState, useEffect } from 'react';
import { DoctorSearchParams, MapChunk } from '../types';
import { findDoctors } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export const DoctorFinder: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; chunks: MapChunk[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [useLocation, setUseLocation] = useState(false);

  useEffect(() => {
    if (useLocation && !coords) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoords({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (err) => {
            console.error("Geo error", err);
            setUseLocation(false);
            alert("Could not retrieve location. Please enter city manually.");
          }
        );
      } else {
        alert("Geolocation not supported");
        setUseLocation(false);
      }
    }
  }, [useLocation, coords]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isProblemEmpty = !problem.trim();
    const isLocationMissing = !location.trim() && !useLocation;

    if (isProblemEmpty && isLocationMissing) {
      setError("Please describe your medical problem and specify a location.");
      return;
    }
    if (isProblemEmpty) {
      setError("Please describe the medical problem or symptom.");
      return;
    }
    if (isLocationMissing) {
      setError("Please enter a city or select 'Near Me'.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const searchParams: DoctorSearchParams = {
        problem,
        location,
        useCurrentLocation: useLocation,
        latitude: coords?.lat,
        longitude: coords?.lng,
      };

      const data = await findDoctors(searchParams);
      setResult(data);
    } catch (err) {
      setError("Failed to find doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Search Card */}
      <div className="glass rounded-3xl shadow-glow border border-white/50 overflow-hidden mb-8 transform transition-all hover:shadow-glow-pink duration-500">
        <div className="p-8 md:p-10 relative">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
             <div className="w-32 h-32 bg-neon-blue rounded-full filter blur-3xl"></div>
          </div>

          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2 bg-gradient-to-br from-neon-blue to-primary rounded-xl text-white shadow-lg">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Find a Specialist</h2>
          </div>
          
          <form onSubmit={handleSearch} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Problem Input */}
              <div className="space-y-2">
                <label htmlFor="problem" className="block text-sm font-bold text-slate-700 ml-1 uppercase tracking-wide">
                  Symptoms / Specialty
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <svg className="h-5 w-5 text-slate-400 group-focus-within:text-neon-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                  </div>
                  <input
                    id="problem"
                    type="text"
                    value={problem}
                    onChange={(e) => {
                      setProblem(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="e.g., Severe migraine, sports injury..."
                    className={`block w-full pl-11 pr-4 py-4 rounded-xl bg-white/60 border border-slate-200 focus:bg-white focus:border-neon-blue focus:ring-4 focus:ring-neon-blue/20 transition-all duration-200 outline-none font-medium text-lg ${error && !problem.trim() ? 'bg-red-50 ring-2 ring-red-100' : 'hover:bg-white/80'}`}
                  />
                </div>
              </div>

              {/* Location Input */}
              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-bold text-slate-700 ml-1 uppercase tracking-wide">
                  Location
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-grow group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400 group-focus-within:text-neon-pink transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      id="location"
                      type="text"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        if (e.target.value) setUseLocation(false);
                        if (error) setError(null);
                      }}
                      disabled={useLocation}
                      placeholder={useLocation ? "Using GPS location" : "City, State or Zip"}
                      className={`block w-full pl-11 pr-4 py-4 rounded-xl bg-white/60 border border-slate-200 focus:bg-white focus:border-neon-pink focus:ring-4 focus:ring-neon-pink/20 transition-all duration-200 outline-none font-medium text-lg ${useLocation ? 'text-neon-purple font-bold bg-neon-purple/5 border-neon-purple/30' : (error && !location.trim() && !useLocation ? 'bg-red-50 ring-2 ring-red-100' : 'hover:bg-white/80')}`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUseLocation(!useLocation);
                      if (!useLocation) setLocation('');
                      if (error) setError(null);
                    }}
                    className={`flex-none px-4 rounded-xl border-2 font-bold transition-all duration-200 flex items-center justify-center ${
                      useLocation 
                        ? 'bg-neon-purple border-neon-purple text-white shadow-lg shadow-neon-purple/30' 
                        : 'bg-white border-slate-200 text-slate-500 hover:border-neon-purple hover:text-neon-purple'
                    }`}
                    title="Use my current location"
                  >
                    <svg className={`w-6 h-6 ${useLocation ? 'animate-pulse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-neon-blue via-primary to-neon-purple hover:from-neon-blue hover:to-neon-pink text-white font-black py-4 px-6 rounded-xl shadow-lg shadow-neon-blue/30 transform transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-xl"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>Search Doctors</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-center gap-3 animate-fade-in">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="space-y-8 animate-fade-in-up">
           {/* Map Cards (Grounding Chunks) */}
           {result.chunks.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1.5 bg-neon-green rounded-full shadow-[0_0_10px_#ccff00]"></div>
                <h3 className="text-2xl font-bold text-slate-800">Top Recommended Locations</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.chunks.map((chunk, idx) => {
                  const mapData = chunk.maps || chunk.web;
                  if (!mapData) return null;
                  return (
                    <a 
                      key={idx}
                      href={mapData.uri}
                      target="_blank"
                      rel="noreferrer"
                      className="group bg-white rounded-2xl shadow-sm hover:shadow-glow-green border border-slate-100 p-5 transition-all duration-300 flex flex-col h-full hover:-translate-y-2 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                        <svg className="w-6 h-6 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>

                      <div className="mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3 group-hover:bg-neon-green group-hover:border-neon-green group-hover:text-slate-900 transition-all duration-300">
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                           </svg>
                        </div>
                        <h4 className="font-bold text-lg text-slate-900 group-hover:text-neon-green-dark line-clamp-1 leading-tight">
                          {mapData.title}
                        </h4>
                      </div>

                      {chunk.maps?.placeAnswerSources?.reviewSnippets?.[0] && (
                         <div className="flex-grow">
                           <div className="relative pl-3 border-l-2 border-slate-200 group-hover:border-neon-green py-1 transition-colors">
                             <p className="text-sm text-slate-600 italic line-clamp-3 leading-relaxed">
                               "{chunk.maps.placeAnswerSources.reviewSnippets[0].snippet}"
                             </p>
                           </div>
                         </div>
                      )}
                      
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-sm font-bold text-slate-400 group-hover:text-neon-green transition-colors">
                        View on Maps &rarr;
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Analysis */}
          <div className="bg-white rounded-3xl shadow-soft p-8 md:p-10 border border-slate-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue rounded-full filter blur-[80px] opacity-10 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2 bg-slate-900 rounded-lg text-neon-blue shadow-lg shadow-neon-blue/20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">AI Recommendation</h3>
            </div>
            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600 prose-a:text-neon-blue relative z-10">
              <ReactMarkdown>{result.text}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};