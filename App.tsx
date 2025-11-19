
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { EmployerDashboard } from './components/EmployerDashboard';
import { SeekerDashboard } from './components/SeekerDashboard';
import { Job, UserRole, LocationData } from './types';

// Mock initial data simulating the Glide "Jobs" table
const INITIAL_JOBS: Job[] = [
  {
    id: '1',
    title: 'Barista',
    companyName: 'Keyif Kahvesi',
    description: 'Deneyimli veya yetiştirilmek üzere barista arıyoruz. Esnek çalışma saatleri.',
    salary: '22.000 TL',
    location: { latitude: 41.0082, longitude: 28.9784, address: 'Taksim, İstanbul' },
    employerId: 'emp1',
    employerName: 'Ahmet Y.',
    postedAt: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: '2',
    title: 'Kurye',
    companyName: 'Hızlı Lojistik',
    description: 'A2 ehliyetli, kendi motoruyla veya şirket motoruyla çalışacak kurye.',
    salary: '30.000 TL + Prim',
    location: { latitude: 41.0122, longitude: 28.9764, address: 'Şişli, İstanbul' },
    employerId: 'emp2',
    employerName: 'Lojistik A.Ş.',
    postedAt: new Date(Date.now() - 172800000), // 2 days ago
  }
];

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.SEEKER);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  
  // Refs for multi-layer parallax
  const blobRef = useRef<HTMLDivElement>(null);
  const particleRef = useRef<HTMLDivElement>(null);

  // Generate random particles once to avoid re-renders
  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 6 + 2}px`, // 2px to 8px
      animationDuration: `${Math.random() * 15 + 10}s`, // 10s to 25s
      animationDelay: `${Math.random() * 10}s`,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      
      // Layer 1: Blobs move slowly (far away)
      if (blobRef.current) {
        blobRef.current.style.transform = `translateY(${scrolled * 0.1}px)`;
      }
      
      // Layer 2: Particles move faster (closer)
      if (particleRef.current) {
        particleRef.current.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Get User Location on Load
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Location error:", error);
          setLoadingLocation(false);
          // Default to Istanbul if location denied for demo purposes
          setLocation({ latitude: 41.0082, longitude: 28.9784 }); 
        }
      );
    } else {
      setLoadingLocation(false);
    }
  }, []);

  const handleToggleRole = () => {
    setUserRole(prev => prev === UserRole.SEEKER ? UserRole.EMPLOYER : UserRole.SEEKER);
  };

  const handlePostJob = (newJobData: Omit<Job, 'id' | 'postedAt' | 'employerId' | 'employerName'>) => {
    const newJob: Job = {
      ...newJobData,
      id: Date.now().toString(),
      postedAt: new Date(),
      employerId: 'current-user', // Simulated ID
      employerName: 'Siz', // Simulated Name
    };
    setJobs(prev => [newJob, ...prev]);
    // Switch to seeker view to see the posted job
    setUserRole(UserRole.SEEKER);
  };

  const handleAddExternalJobs = (newJobs: Job[]) => {
    // Avoid duplicates
    setJobs(prev => {
        const existingIds = new Set(prev.map(j => j.id));
        const uniqueNewJobs = newJobs.filter(j => !existingIds.has(j.id));
        return [...uniqueNewJobs, ...prev];
    });
  };

  return (
    <div className="min-h-screen relative text-slate-900 font-sans pb-20 overflow-hidden">
      
      {/* Showy Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-50">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-white"></div>
        
        {/* Layered Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>
        
        {/* Layer 1: Parallax Blobs (Slower Movement) */}
        <div ref={blobRef} className="absolute inset-0 w-full h-full will-change-transform opacity-80">
            {/* Animated Blobs - More vibrant and larger */}
            <div 
              className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob"
            ></div>
            
            <div 
              className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob-reverse"
              style={{ animationDelay: '2s' }}
            ></div>
            
            <div 
              className="absolute -bottom-32 left-20 w-[500px] h-[500px] bg-pink-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob"
              style={{ animationDelay: '4s' }}
            ></div>

            <div 
              className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-[60px] opacity-50 animate-blob-reverse"
              style={{ animationDelay: '6s' }}
            ></div>
            
             {/* Center floating accent */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse"
              style={{ animationDuration: '8s' }}
            ></div>
        </div>

        {/* Layer 2: Parallax Particles (Faster Movement) */}
        <div ref={particleRef} className="absolute inset-0 w-full h-full will-change-transform">
            {/* Floating Particles */}
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute rounded-full bg-primary-400 animate-float-particle mix-blend-multiply"
                style={{
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: p.size,
                  animationDuration: p.animationDuration,
                  animationDelay: p.animationDelay,
                  opacity: p.opacity,
                }}
              />
            ))}
        </div>

        {/* Static Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoOTksIDExMiwgMTQ0LCAwLjEpIi8+PC9zdmc+')] [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-60 pointer-events-none"></div>
      </div>

      <Navbar currentRole={userRole} onToggleRole={handleToggleRole} />
      
      <main className="pt-6 relative z-10">
        {loadingLocation ? (
           <div className="flex flex-col justify-center items-center h-64 gap-4">
             <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600 absolute inset-0"></div>
             </div>
             <span className="font-medium text-slate-600 animate-pulse">Konum belirleniyor...</span>
           </div>
        ) : (
            <>
             {userRole === UserRole.EMPLOYER ? (
                <EmployerDashboard onPostJob={handlePostJob} userLocation={location} />
             ) : (
                <SeekerDashboard 
                    jobs={jobs} 
                    userLocation={location}
                    onAddExternalJobs={handleAddExternalJobs}
                />
             )}
            </>
        )}
      </main>
    </div>
  );
};

export default App;
