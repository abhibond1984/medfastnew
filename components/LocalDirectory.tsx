import React, { useState } from 'react';

const DIRECTORY_DATA = [
    { name: "Dr. Balamurali Srinivasan", specialty: "Cardiology", facility: "Medanta Hospital", contact: "18008913100", bio: "Leading Cardiac Surgeon. Expert in Aortic surgeries & Heart Transplants.", img: "1559839734-8b1b5b1b3b1b", rating: 4.9, tags: ["Surgeon", "Top Ranked"] },
    { name: "Dr. Sanjiv Kumar Sharma", specialty: "Neurology", facility: "Paras HEC Hospital", contact: "9297991010", bio: "Renowned Neurologist. Specialist in Stroke and Critical Nerve Care.", img: "1537368937625-30c9191b5044", rating: 4.8, tags: ["Brain Care", "Emergency"] },
    { name: "Dr. Anju Kumar", specialty: "Gynecology", facility: "Santevita Hospital", contact: "06517111555", bio: "Expert in IVF and High-risk Pregnancy care with 20+ years experience.", img: "1594822412733-56156761fe5e", rating: 4.9, tags: ["IVF Expert", "Maternity"] },
    { name: "Medanta Hospital", specialty: "Multi-Specialty", facility: "Irba, Ranchi", contact: "18008913100", bio: "Advanced Tertiary Care Medical Center. Ranchi's flagship facility.", img: "1519494091301-4464a7c822e8", rating: 4.7, tags: ["24/7", "ICU Care"] },
    { name: "Orchid Medical Centre", specialty: "Super-Specialty", facility: "Lalpur, Ranchi", contact: "9117100100", bio: "NABH Accredited. Known for precision diagnostics and ICU care.", img: "1538108197003-59ad2bb72639", rating: 4.6, tags: ["NABH", "Diagnostics"] },
    { name: "RIMS Ranchi", specialty: "Govt Hospital", facility: "Bariatu, Ranchi", contact: "06512541533", bio: "The state's largest medical institute and public care provider.", img: "1516549655169-df83a0774514", rating: 4.5, tags: ["Public Care", "Vast Campus"] }
];

interface Props { theme: 'dark' | 'light'; }

export const LocalDirectory: React.FC<Props> = ({ theme }) => {
  const [query, setQuery] = useState('');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const filtered = DIRECTORY_DATA.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) || 
    item.specialty.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-16">
      <div className="max-w-2xl mx-auto">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search Ranchi specialists..." 
            className={`w-full glass-vibrant border rounded-full px-10 py-6 text-xl outline-none shadow-2xl transition-all ${theme === 'dark' ? 'text-white border-white/10 focus:ring-brand-indigo/20' : 'text-slate-900 border-slate-200 focus:ring-brand-indigo/10'}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl group-hover:scale-125 transition-transform duration-500">✨</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtered.map((item, idx) => (
          <div 
            key={idx} 
            className="relative group"
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div className={`glass-vibrant rounded-[3.5rem] overflow-hidden flex flex-col justify-between border-b-8 transition-all duration-700 hover:-translate-y-2 relative z-10 ${theme === 'dark' ? 'hover:border-b-brand-rose' : 'hover:border-b-brand-indigo shadow-2xl'}`}>
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={`https://images.unsplash.com/photo-${item.img}?auto=format&fit=crop&q=80&w=600&h=400`} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-8">
                  <span className="bg-brand-rose text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">Verified Care</span>
                </div>
              </div>

              <div className="p-10 flex-grow">
                <div className="text-[10px] font-black uppercase text-brand-cyan tracking-[0.3em] mb-4">{item.specialty}</div>
                <h3 className={`text-3xl font-display font-black leading-tight transition-all mb-4 ${theme === 'dark' ? 'text-white group-hover:text-brand-rose' : 'text-slate-900'}`}>{item.name}</h3>
                <p className={`text-sm leading-relaxed mb-6 italic ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>"{item.bio}"</p>
              </div>
              
              <div className={`p-10 pt-0 border-t ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                <div className="flex items-center gap-2 mb-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
                  {item.facility}
                </div>
                <a 
                  href={`tel:${item.contact}`}
                  className={`w-full font-black py-5 rounded-[2rem] transition-all text-center block text-sm shadow-xl ${theme === 'dark' ? 'bg-white/5 hover:bg-white hover:text-slate-900 text-white' : 'bg-slate-900 hover:bg-brand-indigo text-white'}`}
                >
                  CONTACT CLINIC
                </a>
              </div>
            </div>

            {/* Directory Hover Insight Pop-up */}
            {hoveredIdx === idx && (
              <div className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-500">
                <div className={`w-full h-full backdrop-blur-3xl rounded-[3.5rem] p-10 border-4 border-brand-rose flex flex-col justify-center gap-8 shadow-[0_0_60px_rgba(244,63,94,0.3)] ${theme === 'dark' ? 'bg-[#0a0f1e]/95' : 'bg-white/98'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} className={`text-2xl ${s <= Math.round(item.rating) ? 'text-brand-rose' : 'text-slate-700'}`}>★</span>
                      ))}
                    </div>
                    <span className="bg-brand-cyan/20 text-brand-cyan text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-widest">{item.rating} Rating</span>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="flex gap-6 items-center">
                       <img src={`https://images.unsplash.com/photo-${item.img}?auto=format&fit=crop&q=80&w=120&h=120`} className="w-20 h-20 rounded-3xl object-cover ring-4 ring-brand-rose/20 shadow-2xl" alt="Dr Profile" />
                       <div>
                          <div className={`font-black text-2xl leading-none mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{item.name}</div>
                          <div className="text-[11px] font-black uppercase text-brand-indigo tracking-widest">{item.specialty} Specialist</div>
                       </div>
                    </div>
                    
                    <p className={`text-base font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                      Providing world-class healthcare in Ranchi. Expert in advanced medical diagnostics and patient-centric treatments with modern facility access.
                    </p>
                    
                    <div className="flex flex-wrap gap-3">
                      {item.tags.map(tag => (
                        <span key={tag} className="bg-brand-indigo/10 text-brand-indigo text-[10px] font-black px-4 py-2 rounded-full border border-brand-indigo/20 uppercase tracking-widest">{tag}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-8 border-t border-white/10 text-center">
                    <span className="text-[11px] font-black text-brand-rose uppercase tracking-[0.3em] animate-pulse">Schedule Appointment Now</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};