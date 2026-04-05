/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import PlantDetail from './pages/PlantDetail';
import Graveyard from './pages/Graveyard';
import AddPlant from './pages/AddPlant';
import Identify from './pages/Identify';
import Settings from './pages/Settings';
import Compare from './pages/Compare';
import Calendar from './pages/Calendar';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';

function AppContent() {
  const location = useLocation();
  const { t } = useLanguage();
  const hideNavPaths = ['/add', '/identify', '/settings'];
  const showNav = !hideNavPaths.includes(location.pathname);
  const showHeader = !hideNavPaths.includes(location.pathname) && !location.pathname.startsWith('/plant/') && location.pathname !== '/compare';

  return (
    <div className="min-h-screen bg-surface transition-colors duration-300">
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plant/:id" element={<PlantDetail />} />
        <Route path="/graveyard" element={<Graveyard />} />
        <Route path="/add" element={<AddPlant />} />
        <Route path="/identify" element={<Identify />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/journal" element={<div className="p-12 text-center text-on-surface-variant">{t.app.journalComingSoon}</div>} />
      </Routes>
      {showNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NotificationProvider>
          <Router>
            <AppContent />
          </Router>
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

