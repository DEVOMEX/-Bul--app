import React from 'react';
import { Job } from '../types';
import { MapPin, Clock, Banknote, Building2, ExternalLink } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  return (
    <div className={`bg-white rounded-xl p-5 shadow-sm border border-slate-100 transition-all hover:shadow-md ${job.isAiGenerated ? 'border-l-4 border-l-purple-400' : 'border-l-4 border-l-primary-500'}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-slate-900">{job.title}</h3>
          <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
            <Building2 className="h-3 w-3" />
            <span className="font-medium">{job.companyName}</span>
          </div>
        </div>
        {job.isAiGenerated && (
          <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full font-medium border border-purple-100">
            Fırsat
          </span>
        )}
      </div>

      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-3 mb-4 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
            <Banknote className="h-3.5 w-3.5 text-green-600" />
            <span>{job.salary}</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
            <MapPin className="h-3.5 w-3.5 text-red-500" />
            <span>{job.location.address || 'Konum Haritada'}</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
            <Clock className="h-3.5 w-3.5 text-orange-500" />
            <span>{new Date(job.postedAt).toLocaleDateString('tr-TR')}</span>
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        {job.mapsUri ? (
           <a 
             href={job.mapsUri}
             target="_blank"
             rel="noreferrer"
             className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
           >
             <ExternalLink className="h-4 w-4" />
             Haritada Gör
           </a>
        ) : (
            <button 
                onClick={() => window.alert(`Konum: ${job.location.latitude}, ${job.location.longitude}`)}
                className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
                <MapPin className="h-4 w-4" />
                Konum
            </button>
        )}
        
        <button 
          onClick={() => onApply(job)}
          className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm shadow-primary-200"
        >
          Başvur / Mesaj
        </button>
      </div>
    </div>
  );
};