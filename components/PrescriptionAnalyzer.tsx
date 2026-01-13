import React, { useState, useRef } from 'react';
import { analyzePrescription } from '../services/geminiService';
import { PrescriptionAnalysisResult } from '../types';

export const PrescriptionAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PrescriptionAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const data = await analyzePrescription(base64);
        setResult(data);
        setLoading(false);
      };
    } catch (err) {
      setError("Analysis failed. Please ensure the image is clear.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 ${result ? 'print:block' : ''}`}>
        
        {/* Left Side: Upload (Hidden on Print if result exists) */}
        <div className={`${result ? 'print:hidden' : ''} space-y-6`}>
          <div className="bg-white rounded-3xl p-8 shadow-soft border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Prescription Decoder</h2>
            <p className="text-slate-500 mb-8 font-medium">Upload your RX for a professional digital summary.</p>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-4 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 ${
                preview ? 'border-neon-green bg-neon-green/5' : 'border-slate-100 hover:border-neon-blue hover:bg-slate-50'
              }`}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-xl shadow-lg" />
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <span className="text-slate-400 font-bold">DRAG OR CLICK TO UPLOAD</span>
                </div>
              )}
              <input 
                type="file" ref={fileInputRef} hidden accept="image/*" 
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
                }} 
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="w-full mt-8 bg-slate-900 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : 'GENERATE PROFESSIONAL REPORT'}
            </button>
            {error && <p className="mt-4 text-red-500 font-bold text-center">{error}</p>}
          </div>
        </div>

        {/* Right Side: Professional Report */}
        <div className={`${result ? 'lg:col-span-1' : 'opacity-50'} print:w-full`}>
          {result ? (
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden print:shadow-none print:border-none">
              {/* Header */}
              <div className="bg-slate-900 text-white p-8 flex justify-between items-end print:bg-white print:text-black print:border-b-4 print:border-black">
                <div>
                  <h1 className="text-3xl font-black tracking-tighter">MED<span className="text-neon-blue">-FAST</span></h1>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Digital Health Record Transcription</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Report Date</div>
                  <div className="text-sm font-mono">{new Date().toLocaleDateString()}</div>
                </div>
              </div>

              <div className="p-8">
                {/* Clinical Summary */}
                <div className="mb-10">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Clinical Summary</h3>
                  <p className="text-slate-800 font-serif leading-relaxed text-lg">{result.summary}</p>
                </div>

                {/* Medication Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-900">
                        <th className="py-3 font-black text-xs uppercase text-slate-500">Medicine</th>
                        <th className="py-3 font-black text-xs uppercase text-slate-500">Purpose</th>
                        <th className="py-3 font-black text-xs uppercase text-slate-500">Instructions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.medicines.map((med, i) => (
                        <tr key={i}>
                          <td className="py-5 pr-4">
                            <div className="font-bold text-slate-900">{med.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-1">{med.contents}</div>
                          </td>
                          <td className="py-5 pr-4">
                            <span className="text-xs font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100">{med.purpose}</span>
                          </td>
                          <td className="py-5">
                            <div className="text-sm text-slate-700 font-medium">{med.dosageInstructions}</div>
                            {med.warnings && (
                              <div className="text-[10px] text-red-500 font-bold mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                {med.warnings}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Print Action */}
                <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center print:hidden">
                   <p className="text-[10px] text-slate-400 max-w-xs leading-tight">This report is AI-transcribed. Always verify with the physical prescription before use.</p>
                   <button onClick={() => window.print()} className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                      Print Digital RX
                   </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full border-4 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-12 text-slate-300">
               <svg className="w-20 h-20 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
               <span className="font-black text-xl opacity-20 tracking-widest uppercase">Analysis Pending</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};