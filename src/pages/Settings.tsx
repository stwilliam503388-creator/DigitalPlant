import React from 'react';
import { ArrowLeft, Globe, Check, Sprout, Skull, PlusCircle, BookOpen, Moon, Sun, Bell, BellOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Language } from '../translations';

export default function Settings() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { notificationsEnabled, toggleNotifications } = useNotifications();

  const languages = [
    { id: 'zh', name: '中文 (简体)', sub: 'Simplified Chinese', icon: '中' },
    { id: 'en', name: 'English', sub: 'United States', icon: 'EN' },
    { id: 'jp', name: '日本語', sub: 'Japanese', icon: '日' },
  ];

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-32 transition-colors duration-300">
      <header className="w-full sticky top-0 z-40 bg-surface/80 backdrop-blur-md flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="active:scale-95 transition-transform p-2 rounded-full hover:bg-surface-container-low"
          >
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="font-headline font-bold tracking-tight text-xl text-primary">{t.settings.title}</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border-2 border-primary-fixed">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9AShP9Jci4dOfSB32PldaOzg_FAn0-PlYsdajbJFxqVxxfzCGtMNx6p8sEDOlbv35wBF1b2gdBtL9-rwHwevWwvmej5l34xSsgDsuASEr6llo_7h5EV_0iSNtLzp0ioKJntlt41XCwUzveEIZfcjbgQ2c1MEw4qsbMfpSIohxGvrZJaILDV0P2m_ExRNp6Sc6duep0RwdV6n2_yBH3RirU4WcTgFo9LbKFWwmPNJGpYTgWVhIRr-F-hZziGLDnCLCFnSzWT_bUtg" 
            alt="User"
            referrerPolicy="no-referrer"
          />
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-8">
        <section className="mb-10 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary to-primary-container rounded-full flex items-center justify-center shadow-lg">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface mb-2">{t.settings.header}</h2>
          <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
            {t.settings.description}
          </p>
        </section>

        {/* Dark Mode Toggle */}
        <section className="mb-10">
          <div 
            onClick={toggleTheme}
            className="flex items-center justify-between p-5 rounded-2xl bg-surface-container-low border border-transparent hover:bg-surface-container-high transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300",
                theme === 'dark' ? "bg-primary text-on-primary" : "bg-secondary-container text-on-secondary-container"
              )}>
                {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-on-surface">
                  {t.settings.darkMode}
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                  {t.settings.darkModeDesc}
                </span>
              </div>
            </div>
            <div className={cn(
              "w-14 h-8 rounded-full relative transition-colors duration-300 p-1",
              theme === 'dark' ? "bg-primary" : "bg-surface-container-highest"
            )}>
              <div className={cn(
                "w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300",
                theme === 'dark' ? "translate-x-6" : "translate-x-0"
              )} />
            </div>
          </div>
        </section>

        {/* Notifications Toggle */}
        <section className="mb-10">
          <div 
            onClick={toggleNotifications}
            className="flex items-center justify-between p-5 rounded-2xl bg-surface-container-low border border-transparent hover:bg-surface-container-high transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300",
                notificationsEnabled ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant"
              )}>
                {notificationsEnabled ? <Bell className="w-6 h-6" /> : <BellOff className="w-6 h-6" />}
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-on-surface">
                  {t.settings.notifications}
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                  {t.settings.notificationsDesc}
                </span>
              </div>
            </div>
            <div className={cn(
              "w-14 h-8 rounded-full relative transition-colors duration-300 p-1",
              notificationsEnabled ? "bg-primary" : "bg-surface-container-highest"
            )}>
              <div className={cn(
                "w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300",
                notificationsEnabled ? "translate-x-6" : "translate-x-0"
              )} />
            </div>
          </div>
        </section>

        <div className="space-y-4">
          {languages.map((item) => (
            <div 
              key={item.id}
              onClick={() => setLanguage(item.id as Language)}
              className={cn(
                "flex items-center justify-between p-5 rounded-xl border transition-all duration-300 cursor-pointer",
                language === item.id 
                  ? "bg-surface-container-lowest border-primary/20 shadow-sm" 
                  : "bg-surface-container-low border-transparent hover:bg-surface-container-high"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
                  language === item.id ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-highest text-on-surface-variant"
                )}>
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <span className={cn("text-lg font-bold", language === item.id ? "text-primary" : "text-on-surface")}>
                    {item.name}
                  </span>
                  <span className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold">
                    {item.sub}
                  </span>
                </div>
              </div>
              {language === item.id && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 px-8 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-full shadow-lg active:scale-95 transition-all"
          >
            {t.settings.save}
          </button>
          <p className="text-xs text-on-surface-variant text-center opacity-70">
            {t.settings.restartNote}
          </p>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-3 bg-surface-container-low/80 backdrop-blur-xl shadow-[0_-12px_32px_rgba(26,28,26,0.06)] rounded-t-[1.5rem]">
        <div onClick={() => navigate('/')} className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 cursor-pointer">
          <Sprout className="w-6 h-6" />
          <span className="text-[11px] font-medium mt-1">{t.nav.garden}</span>
        </div>
        <div onClick={() => navigate('/graveyard')} className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 cursor-pointer">
          <Skull className="w-6 h-6" />
          <span className="text-[11px] font-medium mt-1">{t.nav.graveyard}</span>
        </div>
        <div onClick={() => navigate('/add')} className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 cursor-pointer">
          <PlusCircle className="w-6 h-6" />
          <span className="text-[11px] font-medium mt-1">{t.nav.add}</span>
        </div>
        <div onClick={() => navigate('/journal')} className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 cursor-pointer">
          <BookOpen className="w-6 h-6" />
          <span className="text-[11px] font-medium mt-1">{t.nav.journal}</span>
        </div>
      </nav>
    </div>
  );
}
