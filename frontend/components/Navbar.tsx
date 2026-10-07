import React from 'react';
import { Menu, Recycle, Truck, LayoutDashboard, LogOut, User as UserIcon, Shield, Globe, Settings, ClipboardList, Search } from 'lucide-react';
import { AppView, User, Language } from '../../types';
import { t } from '../../utils/translations';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  user: User;
  onLogout: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, user, onLogout, language, setLanguage }) => {
  if (!user) return null;
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 py-2">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer mr-8" onClick={() => setCurrentView('dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Recycle size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-slate-800">Scrap<span className="font-serif-custom italic text-emerald-600">Seva</span></span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500"><LogOut size={18} /></button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;