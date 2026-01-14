import React, { useState, useRef } from 'react';
import { analyzePrescription } from '../services/geminiService';
import { PrescriptionAnalysisResult } from '../types';

interface Props { theme: 'dark' | 'light'; }

export const PrescriptionAnalyzer: React.FC<Props> = ({ theme }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PrescriptionAnalysisResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processAndAnalyze = async (file: File) => {
    setLoading(true);
    setPreview(URL.createObjectURL(file));
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        // Extract base64 for simulation/API
        const base64 = (reader.result as string).split(',')[1];
        const data = await analyzePrescription(base64); 
        setResult(data);
        setLoading(false);
      };
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndAnalyze(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className={`no-print ${result ? 'hidden lg:block' : ''}`}>
        <div className={`glass-vibrant rounded-[3rem] p-10 md:p-14 text-center border-t-8 border-t-brand-rose transition-all ${loading ? 'opacity-80 scale-[0.98]' : ''}`}>
          <h2 className={`text-4xl font-display font-extrabold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>AI Vision Report</h2>
          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} text-lg mb-12`}>
            {loading ? "Decrypting handwriting and analyzing medical data..." : "Upload your prescription to generate an instant digital report."}
          </p>
          
          <div 
            onClick={() => !loading && fileInputRef.current?.click()}
            className={`group border-4 border-dashed rounded-[3rem] p-16 transition-all cursor-pointer relative overflow-hidden ${
              preview ? 'border-brand-rose bg-brand-rose/5' : theme === 'dark' ? 'border-white/5 hover:border-brand-rose hover:bg-brand-rose/10' : 'border-slate-200 hover:border-brand-rose hover:bg-brand-rose/5'
            }`}
          >
            {loading && (
              <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] z-20 flex items-center justify-center">
                 <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-brand-rose border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-brand-rose font-black text-xs uppercase tracking-widest">Processing...</span>
                 </div>
              </div>
            )}

            {preview ? (
              <img src={preview} alt="RX" className="max-h-80 mx-auto rounded-3xl shadow-2xl transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="py-10 space-y-6">
                <div className="w-20 h-20 bg-brand-rose/20 rounded-full flex items-center justify-center mx-auto text-brand-rose animate-pulse-fast">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <p className={`text-[12px] font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Click to Upload Image</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
          </div>
          
          <div className="mt-8">
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>
              Report will generate automatically after upload
            </p>
          </div>
        </div>
      </div>

      {result && (
        <div className="animate-in zoom-in-95 duration-700 print:m-0">
          <div className={`glass-vibrant rounded-[3rem] overflow-hidden border-t-8 border-t-brand-indigo shadow-2xl`}>
            <div className={`p-10 md:p-14 flex flex-col md:flex-row justify-between items-center gap-6 border-b ${theme === 'dark' ? 'border-white/5 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tighter gradient-text">Med-fast Insight</h1>
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>AI Digitized Record • Verified Analysis • #{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
              </div>
              <div className="flex items-center gap-6">
                 <div className="text-right">
                    <div className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>Generated On</div>
                    <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{new Date().toLocaleDateString()}</div>
                 </div>
                 <button onClick={() => window.print()} className="p-4 bg-brand-indigo text-white rounded-2xl shadow-xl hover:scale-110 active:scale-90 transition-all no-print">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                 </button>
              </div>
            </div>

            <div className="p-8 md:p-14 space-y-12">
              <div className={`p-8 rounded-[2.5rem] border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-brand-indigo/5 border-brand-indigo/10'}`}>
                <h3 className="text-[10px] font-black text-brand-indigo uppercase tracking-[0.3em] mb-4">Patient Brief & Diagnosis</h3>
                <div className={`text-lg md:text-xl font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'} whitespace-pre-wrap`}>
                   {result.summary}
                </div>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl">
                <table className="w-full text-left border-collapse">
                  <thead className={theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-100'}>
                    <tr>
                      <th className={`p-6 text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Medicine & Molecule</th>
                      <th className={`p-6 text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Therapeutic Purpose</th>
                      <th className={`p-6 text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Dosage Instructions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-200'}`}>
                    {result.medicines.map((med, i) => (
                      <tr key={i} className={`hover:bg-brand-indigo/5 transition-colors group`}>
                        <td className="p-8 align-top">
                          <div className={`font-extrabold text-2xl group-hover:text-brand-indigo transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{med.name}</div>
                          <div className={`text-xs font-mono mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{med.contents}</div>
                        </td>
                        <td className="p-8 align-top">
                          <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">{med.purpose}</span>
                        </td>
                        <td className="p-8 align-top">
                          <div className={`text-lg font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{med.dosageInstructions}</div>
                          {med.warnings && (
                            <div className="mt-3 flex items-start gap-2 text-[10px] font-black text-brand-rose uppercase">
                              <span className="animate-pulse">⚠️</span>
                              <span className="leading-tight">{med.warnings}</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center no-print pt-6 border-t border-white/5">
                <button onClick={() => {setResult(null); setPreview(null);}} className={`text-xs font-black uppercase tracking-widest transition-colors ${theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>← Analyze Another Prescription</button>
                <div className={`text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>Automated Medical Insight Layer</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
