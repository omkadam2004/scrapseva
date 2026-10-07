
import React, { useState } from 'react';
import { Recycle, LogOut, User as UserIcon, Sun, Moon, Globe, Check } from 'lucide-react';
import { AppView, User, Language, Theme } from '../types';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  user: User | null;
  onLogout: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, user, onLogout, language, setLanguage, theme, setTheme }) => {
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages: { code: Language; label: string; name: string }[] = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'hi', label: 'HI', name: 'हिंदी' },
    { code: 'mr', label: 'MR', name: 'मराठी' }
  ];

  const navItems = user ? (
    user.role === 'seller' ? [
      { id: 'dashboard', label: language === 'en' ? 'Dashboard' : language === 'hi' ? 'डैशबोर्ड' : 'डॅशबोर्ड' },
      { id: 'my-requests', label: language === 'en' ? 'My Requests' : language === 'hi' ? 'मेरे अनुरोध' : 'माझ्या विनंत्या' },
      { id: 'feedback', label: language === 'en' ? 'Feedback' : language === 'hi' ? 'प्रतिक्रिया' : 'प्रतिक्रिया' },
    ] : user.role === 'collector' ? [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'collection-logs', label: 'Logs' },
      { id: 'manage-rates', label: 'Rates' },
      { id: 'route', label: 'Route' },
    ] : [
      { id: 'dashboard', label: 'Admin Hub' },
    ]
  ) : [];

  return (
    <nav className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50 shadow-sm theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          <div className="flex items-center gap-2 sm:gap-6 flex-shrink-0">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => user && setCurrentView('dashboard')}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 dark:shadow-emerald-500/10 group-active:scale-95 transition-transform">
                <Recycle size={18} className="sm:w-6 sm:h-6" />
              </div>
              <div className="hidden xsm:flex flex-col">
                <span className="font-extrabold text-base sm:text-xl text-zinc-800 dark:text-zinc-100 tracking-tight leading-none">
                  Scrap<span className="font-serif-custom italic text-emerald-500 dark:text-emerald-400">Seva</span>
                </span>
              </div>
            </div>
          </div>
          
          {user && (
            <div className="flex-1 flex items-center overflow-x-auto no-scrollbar scroll-smooth">
              <div className="flex items-center gap-1 sm:gap-4 px-2">
                {navItems.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => setCurrentView(item.id as AppView)} 
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${currentView === item.id ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' : 'text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-300'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
             {/* Language Switcher */}
             <div className="relative">
                <button
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="p-2 sm:p-2.5 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-95 flex items-center gap-1"
                >
                    <Globe size={16} className="sm:w-5 sm:h-5" />
                    <span className="text-[10px] font-bold uppercase hidden sm:inline">{language}</span>
                </button>
                
                {showLangMenu && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)}></div>
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code);
                                        setShowLangMenu(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold transition-colors ${language === lang.code ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50'}`}
                                >
                                    <span>{lang.name}</span>
                                    {language === lang.code && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    </>
                )}
             </div>

             <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 sm:p-2.5 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-95"
             >
                {theme === 'light' ? <Moon size={16} className="sm:w-5 sm:h-5" /> : <Sun size={16} className="sm:w-5 sm:h-5" />}
             </button>

             {user && (
               <div className="flex items-center gap-0.5 sm:gap-1">
                 <button 
                    onClick={() => setCurrentView('profile')} 
                    className={`p-2 sm:p-2.5 rounded-xl transition-all active:scale-95 ${currentView === 'profile' ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                 >
                   <UserIcon size={16} className="sm:w-5 sm:h-5" />
                 </button>
                 <button 
                    onClick={onLogout} 
                    className="p-2 sm:p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all active:scale-95"
                 >
                    <LogOut size={16} className="sm:w-5 sm:h-5" />
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
