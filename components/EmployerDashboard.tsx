import React, { useState, useEffect } from 'react';
import { Job, LocationData } from '../types';
import { generateJobDescription } from '../services/geminiService';
import { Sparkles, Plus, Loader2, MapPinCheck, MapPin } from 'lucide-react';

interface EmployerDashboardProps {
  onPostJob: (job: Omit<Job, 'id' | 'postedAt' | 'employerId' | 'employerName'>) => void;
  userLocation: LocationData | null;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ onPostJob, userLocation }) => {
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [salary, setSalary] = useState('');
  const [address, setAddress] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Set default address text if coordinates exist but address is empty
  useEffect(() => {
    if (userLocation && !address) {
        // We don't have reverse geocoding without an external API, so we leave it empty 
        // or we could set a placeholder. For now, letting the user type is best.
    }
  }, [userLocation]);

  const handleAutoGenerate = async () => {
    if (!title || !companyName) {
      alert('Lütfen önce iş başlığı ve şirket adını giriniz.');
      return;
    }
    setIsGenerating(true);
    const desc = await generateJobDescription(title, companyName);
    setDescription(desc);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use provided address or fallback to a generic string
    const finalAddress = address.trim() || "Konum Seçildi";

    // If userLocation is somehow null (rare due to App defaults), use a fallback coordinate
    const finalLocation: LocationData = userLocation || {
        latitude: 41.0082, 
        longitude: 28.9784,
        address: finalAddress
    };

    onPostJob({
      title,
      companyName,
      description,
      salary,
      location: {
        ...finalLocation,
        address: finalAddress
      }
    });

    // Reset form
    setTitle('');
    setCompanyName('');
    setDescription('');
    setSalary('');
    setAddress('');
    alert('İlan başarıyla yayınlandı!');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="bg-primary-100 p-2 rounded-lg">
                <Plus className="h-6 w-6 text-primary-600" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">Yeni İş İlanı Ekle</h2>
                <p className="text-sm text-slate-500">Çevrenizdeki adaylara ulaşın</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">İş Başlığı</label>
              <input
                required
                type="text"
                placeholder="Örn: Garson, Aşçı, Kurye"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">İş Yeri Adı</label>
              <input
                required
                type="text"
                placeholder="Örn: Merkez Kafe"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">İş Açıklaması</label>
              <button
                type="button"
                onClick={handleAutoGenerate}
                disabled={isGenerating}
                className="text-xs flex items-center gap-1 text-purple-600 font-medium hover:text-purple-700"
              >
                {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                AI ile Yaz
              </button>
            </div>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="İş hakkında detaylar..."
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Maaş / Ücret</label>
                <input
                required
                type="text"
                placeholder="Örn: 20.000 TL + Prim"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Açık Adres (İsteğe Bağlı)</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cadde, Sokak, Bina No..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    />
                </div>
             </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg flex items-center gap-3 border border-slate-200">
             <div className={`p-2 rounded-full shadow-sm ${userLocation ? 'bg-green-100' : 'bg-orange-100'}`}>
                <MapPinCheck className={`h-5 w-5 ${userLocation ? 'text-green-600' : 'text-orange-500'}`} />
             </div>
             <div className="text-sm">
                <p className="font-medium text-slate-800">
                    {userLocation ? "GPS Konumu Eklendi" : "GPS Konumu Alınamadı"}
                </p>
                <p className="text-slate-500">
                    {userLocation 
                        ? "Adaylar sizi haritada mevcut konumunuzda görecek." 
                        : "Lütfen yukarıdaki adres alanına detaylı konum giriniz."}
                </p>
             </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 active:scale-95 transform duration-150"
          >
            İlanı Yayınla
          </button>
        </form>
      </div>
    </div>
  );
};