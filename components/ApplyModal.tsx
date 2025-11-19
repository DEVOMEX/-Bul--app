
import React, { useState } from 'react';
import { Job } from '../types';
import { X, Send, CheckCircle2, Building2, Loader2, AlertCircle } from 'lucide-react';

interface ApplyModalProps {
  job: Job | null;
  onClose: () => void;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export const ApplyModal: React.FC<ApplyModalProps> = ({ job, onClose }) => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  if (!job) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call with high success rate
    setTimeout(() => {
      const isSuccess = Math.random() > 0.05; // 95% chance of success
      
      if (isSuccess) {
        setStatus('success');
        setTimeout(() => {
          setMessage('');
          setStatus('idle');
          onClose();
        }, 1500);
      } else {
        setStatus('error');
        setTimeout(() => {
          setStatus('idle');
        }, 2000);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden scale-100 transition-all">
        
        {/* Header */}
        <div className="bg-primary-600 p-4 flex justify-between items-center">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary-100" />
            {job.companyName}
          </h3>
          <button onClick={onClose} className="text-primary-100 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="font-semibold text-slate-800 text-lg mb-1">{job.title}</h4>
            <p className="text-sm text-slate-500">
              Bu ilana başvurmak üzeresiniz. İşverene kısa bir not bırakabilirsiniz.
            </p>
          </div>

          <form onSubmit={handleSend}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Mesajınız</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Merhaba, ilanınızla ilgileniyorum. Tecrübem var..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none text-slate-700 bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 transition-colors"
                disabled={status !== 'idle'}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={status !== 'idle'}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={status !== 'idle'}
                className={`flex-1 py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 shadow-lg flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:shadow-none
                  ${status === 'idle' ? 'bg-primary-600 hover:bg-primary-700 shadow-primary-200' : ''}
                  ${status === 'loading' ? 'bg-primary-400' : ''}
                  ${status === 'success' ? 'bg-green-600 shadow-green-200 scale-105' : ''}
                  ${status === 'error' ? 'bg-red-500 shadow-red-200 animate-error-shake' : ''}
                `}
              >
                {status === 'loading' && (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Gönderiliyor...</span>
                  </>
                )}
                {status === 'success' && (
                  <>
                    <CheckCircle2 className="h-5 w-5 animate-bounce" />
                    <span>İletildi!</span>
                  </>
                )}
                {status === 'error' && (
                  <>
                    <AlertCircle className="h-5 w-5" />
                    <span>Hata!</span>
                  </>
                )}
                {status === 'idle' && (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Başvuruyu Gönder</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
