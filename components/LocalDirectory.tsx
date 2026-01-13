import React, { useState } from 'react';

const DIRECTORY_DATA = [
    { name: "Dr. Balamurali Srinivasan", specialty: "Cardiology", facility: "Medanta Hospital", contact: "18008913100", bio: "Leading Cardiac Surgeon. Expert in Aortic surgeries & Heart Transplants.", img: "1559839734-8b1b5b1b3b1b" },
    { name: "Dr. Sanjiv Kumar Sharma", specialty: "Neurology", facility: "Paras HEC Hospital", contact: "9297991010", bio: "Renowned Neurologist. Specialist in Stroke and Critical Nerve Care.", img: "1537368937625-30c9191b5044" },
    { name: "Dr. Anju Kumar", specialty: "Gynecology", facility: "Santevita Hospital", contact: "06517111555", bio: "Expert in IVF and High-risk Pregnancy care with 20+ years experience.", img: "1594822412733-56156761fe5e" },
    { name: "Medanta Hospital", specialty: "Multi-Specialty", facility: "Irba, Ranchi", contact: "18008913100", bio: "Advanced Tertiary Care Medical Center. Ranchi's flagship facility.", img: "1519494091301-4464a7c822e8" },
    { name: "Orchid Medical Centre", specialty: "Super-Specialty", facility: "Lalpur, Ranchi", contact: "9117100100", bio: "NABH Accredited. Known for precision diagnostics and ICU care.", img: "1538108197003-59ad2bb72639" },
    { name: "RIMS Ranchi", specialty: "Govt Hospital", facility: "Bariatu, Ranchi", contact: "06512541533", bio: "The state's largest medical institute and public care provider.", img: "1516549655169-df83a0774514" }
];

interface Props { theme: 'dark' | 'light'; }

export const LocalDirectory: React.FC<Props> = ({ theme }) => {
  const [query, setQuery] = useState('');

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
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl opacity-40">✨</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item, idx) => (
          <div key={idx} className={`glass-vibrant rounded-[3rem] overflow-hidden flex flex-col justify-between border-b-8 group transition-all duration-500 hover:-translate-y-2 ${theme === 'dark' ? 'hover:border-b-brand-indigo' : 'hover:border-b-brand-cyan shadow-xl'}`}>
            <div className="h-56 overflow-hidden relative">
              <img 
                src={`https://images.unsplash.com/photo-${item.img}?auto=format&fit=crop&q=80&w=600&h=400`} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-8">
                <span className="bg-brand-indigo text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-[0.2em]">Verified Hub</span>
              </div>
            </div>

            <div className="p-10 flex-grow">
              <div className="text-[10px] font-black uppercase text-brand-cyan tracking-[0.3em] mb-4">{item.specialty}</div>
              <h3 className={`text-3xl font-display font-extrabold transition-all mb-4 ${theme === 'dark' ? 'text-white group-hover:gradient-text' : 'text-slate-900'}`}>{item.name}</h3>
              <p className={`text-sm leading-relaxed mb-10 italic ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>"{item.bio}"</p>
            </div>
            
            <div className={`p-10 pt-0 border-t ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2 mb-6 text-[11px] font-black uppercase tracking-widest text-slate-500">
                <span className="w-2 h-2 rounded-full bg-brand-cyan"></span>
                {item.facility}
              </div>
              <a 
                href={`tel:${item.contact}`}
                className={`w-full font-black py-5 rounded-2xl transition-all text-center block text-sm shadow-xl ${theme === 'dark' ? 'bg-white/5 hover:bg-white hover:text-slate-900 text-white' : 'bg-slate-900 hover:bg-brand-indigo text-white'}`}
              >
                CONTACT NOW
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};