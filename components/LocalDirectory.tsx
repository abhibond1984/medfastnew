import React, { useState } from 'react';

const DIRECTORY_DATA = [
    {
        name: "Dr. Balamurali Srinivasan",
        type: "doctor",
        specialty: "Cardiology",
        facility: "Medanta Hospital, Irba",
        contact: "18008913100",
        bio: "Associate Director of Cardiac Care with expertise in Aortic surgeries, VATS, and ECMO management. Renowned for complex bypass and minimally invasive heart surgeries."
    },
    {
        name: "Dr. Sanjiv Kumar Sharma",
        type: "doctor",
        specialty: "Neurology",
        facility: "Paras HEC Hospital, Dhurwa",
        contact: "9297991010",
        bio: "Senior Consultant specializing in Stroke management, Migraine, and Epilepsy. Expert in managing complex neurological conditions with over 15 years of experience."
    },
    {
        name: "Dr. Ashutosh Kumar Thakur",
        type: "doctor",
        specialty: "Internal Medicine",
        facility: "Paras HEC Hospital",
        contact: "9297991010",
        bio: "Director and HOD with extensive experience in clinical medicine. Highly regarded for treating multi-organ systemic disorders and critical care cases."
    },
    {
        name: "Dr. Anju Kumar",
        type: "doctor",
        specialty: "Gynecology",
        facility: "Santevita Hospital, Albert Ekka Chowk",
        contact: "06517111555",
        bio: "Senior specialist in Obstetrics and Gynecology. Expert in high-risk pregnancy management, infertility treatments, and laparoscopic surgeries."
    },
    {
        name: "Dr. Surjit Prasad",
        type: "doctor",
        specialty: "Psychiatry",
        facility: "Mind Space Clinic, Kanke Road",
        contact: "06512450303",
        bio: "Expert psychiatrist specializing in mental health, clinical depression, and anxiety disorders. Known for a patient-centric approach to mental wellness."
    },
    {
        name: "Medanta Abdur Razzaque Memorial",
        type: "hospital",
        specialty: "Multi-Specialty",
        facility: "Irba, Ormanjhi",
        contact: "18008913100",
        bio: "Ranchi's premier multi-specialty destination. NABH accredited with advanced centers for Heart, Neuro, and Kidney diseases."
    },
    {
        name: "Orchid Medical Centre",
        type: "hospital",
        specialty: "Super-Specialty",
        facility: "Lalpur, Ranchi",
        contact: "9117100100",
        bio: "A 150-bed NABH accredited facility providing advanced diagnostics, critical care, and emergency services 24/7."
    },
    {
        name: "Rajendra Institute of Medical Sciences (RIMS)",
        type: "hospital",
        specialty: "Government Hospital",
        facility: "Bariatu, Ranchi",
        contact: "06512541533",
        bio: "The state's largest government medical institute. Offers multi-disciplinary healthcare ranging from cardiology to oncology at subsidized rates."
    }
];

export const LocalDirectory: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'doctor' | 'hospital'>('all');
  const [search, setSearch] = useState('');

  const filtered = DIRECTORY_DATA.filter(item => {
    const matchType = activeFilter === 'all' || item.type === activeFilter;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                        item.specialty.toLowerCase().includes(search.toLowerCase()) ||
                        item.bio.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="py-10">
      <div className="text-center mb-12">
         <h2 className="text-4xl font-black text-slate-900 mb-2">Ranchi Health Connect <span className="text-neon-pink">2026</span></h2>
         <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Top-rated specialists and medical centers</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-10 sticky top-20 z-40 bg-slate-50/80 backdrop-blur-md py-4">
        <input 
          type="text" 
          placeholder="Search by name, specialty, or clinic..." 
          className="flex-grow p-4 rounded-2xl border-2 border-slate-100 shadow-sm focus:border-neon-pink outline-none font-medium transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
           {(['all', 'doctor', 'hospital'] as const).map(f => (
             <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeFilter === f ? 'bg-neon-pink text-white shadow-lg shadow-neon-pink/30' : 'text-slate-400 hover:text-slate-600'}`}
             >
               {f === 'all' ? 'All' : f + 's'}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft hover:shadow-glow-pink hover:-translate-y-2 transition-all duration-300 group">
             <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ${item.type === 'hospital' ? 'bg-amber-100 text-amber-700' : 'bg-neon-green/10 text-green-700'}`}>
                {item.specialty}
             </div>
             <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-neon-pink transition-colors">{item.name}</h3>
             <div className="flex items-center gap-2 text-neon-blue font-bold text-xs mb-4">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {item.facility}
             </div>
             <p className="text-slate-500 text-sm leading-relaxed mb-6 border-l-2 border-slate-100 pl-4 font-medium">{item.bio}</p>
             <a 
              href={`tel:${item.contact}`}
              className="w-full bg-slate-50 group-hover:bg-neon-pink group-hover:text-white text-slate-900 font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-100"
             >
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
               {item.contact}
             </a>
          </div>
        ))}
      </div>
    </div>
  );
};