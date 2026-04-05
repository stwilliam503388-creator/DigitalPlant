import React from 'react';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function Header() {
  const { t } = useLanguage();
  return (
    <header className="w-full sticky top-0 z-40 bg-surface/80 backdrop-blur-md flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-4">
        <button className="p-2 transition-colors duration-300 hover:bg-surface-container-low rounded-full text-primary">
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/" className="text-xl font-bold text-primary font-headline tracking-tight">
          {t.home.title}
        </Link>
      </div>
      <Link to="/settings" className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed">
        <img 
          className="w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9AShP9Jci4dOfSB32PldaOzg_FAn0-PlYsdajbJFxqVxxfzCGtMNx6p8sEDOlbv35wBF1b2gdBtL9-rwHwevWwvmej5l34xSsgDsuASEr6llo_7h5EV_0iSNtLzp0ioKJntlt41XCwUzveEIZfcjbgQ2c1MEw4qsbMfpSIohxGvrZJaILDV0P2m_ExRNp6Sc6duep0RwdV6n2_yBH3RirU4WcTgFo9LbKFWwmPNJGpYTgWVhIRr-F-hZziGLDnCLCFnSzWT_bUtg" 
          alt="User Profile"
          referrerPolicy="no-referrer"
        />
      </Link>
    </header>
  );
}
