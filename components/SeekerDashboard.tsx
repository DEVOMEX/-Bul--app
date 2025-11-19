import React, { useState } from 'react';
import { Job, LocationData } from '../types';
import { JobCard } from './JobCard';
import { ApplyModal } from './ApplyModal';
import { Search, Map, List, RotateCw } from 'lucide-react';
import { findNearbyOpportunities } from '../services/geminiService';

interface SeekerDashboardProps {
  jobs: Job[];
  userLocation: LocationData | null;
  onAddExternalJobs: (jobs: Job[]) => void;
}

export const SeekerDashboard: React.FC<SeekerDashboardProps> = ({ jobs, userLocation, onAddExternalJobs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isSearchingExternal, setIsSearchingExternal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchNearby = async () => {
    if (!userLocation) {
        alert("Lütfen konum izni veriniz.");
        return;
    }
    
    setIsSearchingExternal(true);
    // If search term is empty, default to generic
    const query = searchTerm || "iş yerleri";
    
    const newOpportunities = await findNearbyOpportunities(query, userLocation);
    if (newOpportunities.length > 0) {
        onAddExternalJobs(newOpportunities);
    } else {
        alert("Yakında yeni bir fırsat bulunamadı. Arama terimini değiştirmeyi deneyin.");
    }
    setIsSearchingExternal(false);
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      
      {/* Header & Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                type="text"
                placeholder="Meslek ara (Garson, Satış...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none shadow-sm"
                />
            </div>
            <button 
                onClick={handleSearchNearby}
                disabled={isSearchingExternal}
                className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-2 justify-center whitespace-nowrap"
            >
                {isSearchingExternal ? <RotateCw className="h-5 w-5 animate-spin" /> : <Map className="h-5 w-5" />}
                Yakınımdaki İşlere Bak
            </button>
        </div>

        <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800">
                {filteredJobs.length} İlan Bulundu
            </h2>
            <div className="bg-white p-1 rounded-lg border border-slate-200 flex">
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <List className="h-5 w-5" />
                </button>
                <button 
                    onClick={() => setViewMode('map')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'map' ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <Map className="h-5 w-5" />
                </button>
            </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} onApply={handleApply} />
            ))}
            {filteredJobs.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-100 border-dashed">
                    <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Search className="h-8 w-8 text-slate-300" />
                    </div>
                    <p className="text-slate-500 mb-2">Aradığınız kriterlere uygun ilan bulunamadı.</p>
                    <button onClick={handleSearchNearby} className="text-primary-600 font-medium hover:underline">
                        Haritada ara
                    </button>
                </div>
            )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 h-[500px] flex flex-col items-center justify-center text-center">
             <div className="bg-primary-50 p-4 rounded-full mb-4 animate-pulse">
                <Map className="h-10 w-10 text-primary-500" />
             </div>
             <h3 className="font-bold text-slate-800 text-lg">Harita Görünümü</h3>
             <p className="text-slate-500 max-w-xs mx-auto mb-6">
                 Bu demo sürümünde harita görselleştirilmesi simüle edilmiştir. İlanların gerçek konumlarını listeleme üzerinden "Haritada Gör" diyerek açabilirsiniz.
             </p>
             <button 
                onClick={() => setViewMode('list')}
                className="text-primary-600 font-medium border border-primary-200 px-4 py-2 rounded-lg hover:bg-primary-50"
             >
                Listeye Dön
             </button>
        </div>
      )}

      {/* Modal for Applying */}
      {selectedJob && (
        <ApplyModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
        />
      )}
    </div>
  );
};