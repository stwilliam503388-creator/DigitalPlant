import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sprout, Skull, PlusCircle, BookOpen, BarChart2, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

export default function BottomNav() {
  const { t } = useLanguage();
  const navItems = [
    { to: '/', icon: Sprout, label: t.nav.garden },
    { to: '/calendar', icon: CalendarIcon, label: t.nav.calendar },
    { to: '/add', icon: PlusCircle, label: t.nav.add },
    { to: '/compare', icon: BarChart2, label: t.nav.compare },
    { to: '/graveyard', icon: Skull, label: t.nav.graveyard },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-8 pt-3 bg-surface-container-low/80 backdrop-blur-xl z-50 rounded-t-[1.5rem] shadow-[0_-12px_32px_rgba(26,28,26,0.06)] transition-colors duration-300">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 rounded-full",
              isActive 
                ? "bg-gradient-to-br from-primary to-primary-container text-on-primary scale-105 shadow-lg" 
                : "text-on-surface-variant hover:text-primary"
            )
          }
        >
          <Icon className="w-6 h-6" />
          <span className="text-[11px] font-medium mt-1">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
