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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64String = result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const base64 = await convertToBase64(file);
      const data = await analyzePrescription(base64);
      setResult(data);
    } catch (err) {
      setError("Unable to analyze the image. Please ensure it is clear and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 print:hidden">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="glass rounded-3xl shadow-glow border border-white/50 overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green rounded-full filter blur-[60px] opacity-10 pointer-events-none"></div>

            <div className="p-8">
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2 bg-gradient-to-br from-neon-green to-teal-400 rounded-lg text-slate-900 shadow-md">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Upload Prescription</h2>
              </div>
              <p className="text-slate-600 mb-8 font-medium">Take a clear photo of your doctor's prescription. AI will transcribe and structure the details for you.</p>
              
              <div 
                className={`group relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                  preview 
                    ? 'border-neon-green bg-neon-green/10' 
                    : 'border-slate-300 hover:border-neon-green hover:bg-slate-50 hover:shadow-inner'
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const f = e.dataTransfer.files[0];
                    setFile(f);
                    setPreview(URL.createObjectURL(f));
                    setResult(null);
                    setError(null);
                  }
                }}
                onClick={() => !preview && fileInputRef.current?.click()}
              >
                {preview ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-slate-900/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                       <p className="text-white font-bold tracking-wide">CLICK TO CHANGE</p>
                    </div>
                    <img 
                      src={preview} 
                      alt="Prescription Preview" 
                      className="max-h-80 mx-auto rounded-lg shadow-md object-contain bg-white" 
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setPreview(null);
                        setResult(null);
                      }}
                      className="absolute -top-3 -right-3 bg-neon-pink text-white rounded-full p-2 shadow-lg hover:bg-pink-600 transition-transform hover:scale-110 border-2 border-white"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="py-8">
                    <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:text-neon-green transition-all duration-300 shadow-inner">
                      <svg className="w-10 h-10 dance-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <p className="text-lg font-bold text-slate-700">Click or Drag image here</p>
                    <p className="text-slate-400 text-sm mt-2 font-medium">Supports JPG, PNG</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!file || loading}
                className="w-full mt-8 bg-gradient-to-r from-neon-green to-teal-400 hover:from-neon-green hover:to-lime-400 text-slate-900 font-black py-4 px-6 rounded-xl shadow-lg shadow-neon-green/30 transform transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-xl"
              >
                {loading ? (
                   <span className="flex items-center justify-center gap-2">
                   <svg className="animate-spin h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Processing Image...
                 </span>
                ) : 'Generate Report'}
              </button>
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
                  <p className="font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Placeholder / Instructions for the right side when empty */}
        {!result && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12 min-h-[400px] border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50/50 relative overflow-hidden">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-green rounded-full filter blur-[100px] opacity-20 pointer-events-none"></div>
               <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 relative z-10">
                 <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                 </svg>
               </div>
               <p className="text-xl font-bold text-slate-500 relative z-10 text-center">AI Analysis Report</p>
               <p className="text-sm text-slate-400 max-w-xs text-center mt-2 relative z-10">
                   The extracted data will be presented here in a professional structured format.
               </p>
            </div>
        )}
      </div>

      {/* Results Section - The "Professional Report" */}
      {result && (
        <div className="mt-0 lg:-mt-[500px] lg:col-start-2 lg:row-start-1 lg:ml-[calc(50%+1.5rem)] animate-fade-in-up print:m-0 print:col-auto print:row-auto print:w-full">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-none print:w-full">
               
               {/* Report Header */}
               <div className="bg-slate-50 border-b border-slate-200 p-6 flex justify-between items-center print:bg-white print:border-b-2 print:border-black">
                  <div>
                     <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Transcription Record</h2>
                     <p className="text-sm text-slate-500 mt-1 font-medium">Digital Prescription Analysis • {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="hidden sm:block text-right">
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reference ID</div>
                     <div className="font-mono text-slate-600">#{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</div>
                  </div>
               </div>

               <div className="p-6 md:p-8">
                  {/* Summary Block */}
                  <div className="mb-8 bg-blue-50 rounded-lg p-5 border border-blue-100 print:bg-white print:border print:border-slate-300">
                     <h3 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Clinical Summary
                     </h3>
                     <p className="text-slate-800 leading-relaxed text-sm md:text-base font-serif">{result.summary}</p>
                  </div>

                  {/* Medicines Table */}
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                           <tr className="border-b-2 border-slate-800">
                              <th className="py-3 pr-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-1/4">Medication</th>
                              <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-1/4">Purpose</th>
                              <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-1/4">Instructions</th>
                              <th className="py-3 pl-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-1/4">Notes/Warnings</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                           {result.medicines.map((med, idx) => (
                              <tr key={idx} className="group hover:bg-slate-50 transition-colors print:hover:bg-white">
                                 <td className="py-4 pr-4 align-top">
                                    <div className="font-bold text-slate-900 text-sm md:text-base">{med.name}</div>
                                    <div className="text-xs text-slate-500 font-mono mt-1">{med.contents}</div>
                                 </td>
                                 <td className="py-4 px-4 align-top">
                                    <span className="inline-block bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-semibold print:bg-white print:border print:border-slate-300">
                                       {med.purpose}
                                    </span>
                                 </td>
                                 <td className="py-4 px-4 align-top text-slate-700 font-medium text-sm">
                                    {med.dosageInstructions || "As directed"}
                                 </td>
                                 <td className="py-4 pl-4 align-top">
                                    {med.warnings ? (
                                       <div className="text-xs md:text-sm text-red-700 font-medium flex items-start gap-1.5 bg-red-50 p-2 rounded print:bg-white print:text-black print:p-0">
                                          <svg className="w-4 h-4 flex-shrink-0 mt-0.5 print:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                          <span className="leading-snug">{med.warnings}</span>
                                       </div>
                                    ) : (
                                       <span className="text-slate-300 text-xs italic">--</span>
                                    )}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
                  
                  {/* Footer / Disclaimer */}
                  <div className="mt-10 pt-6 border-t border-slate-100 text-slate-400 text-[10px] md:text-xs leading-relaxed text-center print:text-black print:mt-20">
                     <p><strong>DISCLAIMER:</strong> This report is generated by an AI model for informational purposes only. It is NOT a valid medical prescription. Errors in transcription may occur. Always verify details with the original document and consult a certified medical professional.</p>
                  </div>
               </div>
               
               {/* Actions Bar (Hidden on Print) */}
               <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center print:hidden">
                  <span className="text-xs text-slate-500 font-medium ml-2">Ranchi Free Prescription Reader</span>
                  <button onClick={() => window.print()} className="px-5 py-2.5 bg-slate-900 text-white rounded-lg shadow-md hover:bg-slate-800 transition-colors flex items-center gap-2 font-bold text-sm">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                     Print Report
                  </button>
               </div>
            </div>
        </div>
      )}
    </div>
  );
};