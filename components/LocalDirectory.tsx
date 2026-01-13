import React, { useState } from 'react';

const DIRECTORY_DATA = [
    // --- DOCTORS ---
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

    // --- HOSPITALS ---
    {
        name: "Medanta Abdur Razzaque Ansari Memorial",
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

type FilterType = 'all' | 'doctor' | 'hospital';

export const LocalDirectory: React.FC = () => {
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = DIRECTORY_DATA.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const term = searchTerm.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(term) ||
                          item.specialty.toLowerCase().includes(term) ||
                          item.facility.toLowerCase().includes(term) ||
                          item.bio.toLowerCase().includes(term);
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-fade-in relative">
      <div className="text-center mb-10 relative z-10">
        <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Ranchi Health Connect <span className="text-neon-pink">2026</span></h2>
        <p className="text-slate-500 font-medium text-lg">Your directory for top-rated specialists and medical centers</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col items-center gap-6 mb-12 relative z-10">
        <div className="relative w-full max-w-xl group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400 group-focus-within:text-neon-pink transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                placeholder="Search name, specialty, or clinic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-11 pr-4 py-4 rounded-full bg-white border-2 border-slate-100 shadow-lg focus:border-neon-pink focus:ring-4 focus:ring-neon-pink/10 transition-all duration-300 outline-none font-medium text-slate-700"
            />
        </div>

        <div className="flex bg-white p-1.5 rounded-full border border-slate-200 shadow-sm">
            {(['all', 'doctor', 'hospital'] as FilterType[]).map((type) => (
                <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 capitalize ${
                        filterType === type
                            ? 'bg-neon-pink text-white shadow-lg shadow-neon-pink/30'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-neon-pink'
                    }`}
                >
                    {type === 'all' ? 'All' : `${type}s`}
                </button>
            ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {filteredData.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 flex flex-col hover:shadow-glow-pink hover:-translate-y-2 transition-all duration-300 group">
                <div className="mb-4">
                    <span 
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${
                            item.type === 'hospital' 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-green-100 text-green-800'
                        }`}
                    >
                        {item.specialty}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-neon-pink transition-colors">
                        {item.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-neon-blue font-semibold text-sm">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.facility}
                    </div>
                </div>

                <div className="mb-6 flex-grow border-l-2 border-slate-200 pl-3">
                    <p className="text-slate-600 text-sm leading-relaxed">
                        {item.bio}
                    </p>
                </div>

                <a 
                    href={`tel:${item.contact}`} 
                    className="block w-full text-center bg-primary hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call: {item.contact}
                </a>
            </div>
        ))}
        {filteredData.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-400 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-xl font-medium">No results found for "{searchTerm}"</p>
                <p className="text-slate-400 mt-2">Try searching for 'Cardiology' or 'Medanta'</p>
            </div>
        )}
      </div>
    </div>
  );
};