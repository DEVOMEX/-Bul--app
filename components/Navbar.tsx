
import React from 'react';
import { UserRole } from '../types';
import { Briefcase, User, MapPin } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onToggleRole: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole, onToggleRole }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-primary-600 to-primary-500 p-2 rounded-xl shadow-lg shadow-primary-500/30">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight">İşBul</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleRole}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary-700 transition-all bg-white/50 hover:bg-white px-4 py-2 rounded-full border border-slate-200 hover:border-primary-200 hover:shadow-md group"
            >
              {currentRole === UserRole.SEEKER ? (
                <>
                  <User className="h-4 w-4 text-primary-500 group-hover:scale-110 transition-transform" />
                  <span>İş Arıyorum</span>
                </>
              ) : (
                <>
                  <Briefcase className="h-4 w-4 text-purple-500 group-hover:scale-110 transition-transform" />
                  <span>İşverenim</span>
                </>
              )}
            </button>
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 p-[2px] shadow-md cursor-pointer hover:scale-105 transition-transform">
                <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                   <User className="h-5 w-5 text-slate-400" />
                </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
