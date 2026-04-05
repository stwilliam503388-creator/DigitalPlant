import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Droplets, Sun, Thermometer, Info, Leaf, Calendar, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PLANTS } from '../constants';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

export default function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const initialPlant = PLANTS.find(p => p.id === id) || PLANTS[0];
  
  const [history, setHistory] = useState(initialPlant.history || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    date: new Date().toISOString().split('T')[0],
    event: '',
    description: ''
  });

  const getPlantTranslation = (id: string) => {
    switch (id) {
      case '1': return t.plants.fiddleLeaf;
      case '2': return t.plants.monstera;
      case '3': return t.plants.snakePlant;
      case '4': return t.plants.goldenPothos;
      default: return t.plants.fiddleLeaf;
    }
  };

  const translation = getPlantTranslation(initialPlant.id);

  const handleAddHistory = () => {
    if (!newEvent.event || !newEvent.date) return;
    
    const updatedHistory = [
      {
        ...newEvent,
        date: new Date(newEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      },
      ...history
    ];
    
    setHistory(updatedHistory);
    setShowAddModal(false);
    setNewEvent({
      date: new Date().toISOString().split('T')[0],
      event: '',
      description: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-32">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 w-full bg-surface/80 backdrop-blur-md">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-primary transition-colors hover:bg-surface-container-high"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="font-headline font-bold tracking-tight text-primary">{t.home.title}</div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-primary transition-colors hover:bg-surface-container-high">
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative px-6 pt-4 pb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full aspect-[4/5] md:aspect-[16/9] overflow-hidden rounded-[2rem] shadow-sm"
          >
            <img 
              src={initialPlant.image} 
              alt={translation.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-primary/60 to-transparent flex flex-col justify-end h-1/2">
              <span className="text-secondary-fixed font-medium tracking-widest text-[10px] uppercase mb-2">
                {initialPlant.family || t.detail.botanicalSpecimen}
              </span>
              <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-white tracking-tighter">
                {translation.scientificName || translation.name}
              </h1>
            </div>
          </motion.div>

          {/* Quick Stats Overlap */}
          <div className="flex gap-4 -mt-10 px-4 relative z-10 overflow-x-auto no-scrollbar">
            <div className="flex-shrink-0 bg-surface-container-lowest shadow-sm rounded-2xl p-4 flex flex-col items-center min-w-[100px] border border-outline-variant/10">
              <Droplets className="w-5 h-5 text-primary mb-1 fill-current" />
              <span className="text-[10px] text-on-surface-variant font-medium">{t.detail.nextWater}</span>
              <span className="text-sm font-bold text-primary">{t.detail.inDays.replace('{days}', '2')}</span>
            </div>
            <div className="flex-shrink-0 bg-surface-container-lowest shadow-sm rounded-2xl p-4 flex flex-col items-center min-w-[100px] border border-outline-variant/10">
              <Sun className="w-5 h-5 text-tertiary mb-1 fill-current" />
              <span className="text-[10px] text-on-surface-variant font-medium">{t.detail.light}</span>
              <span className="text-sm font-bold text-on-surface">{initialPlant.light || t.detail.indirect}</span>
            </div>
            <div className="flex-shrink-0 bg-surface-container-lowest shadow-sm rounded-2xl p-4 flex flex-col items-center min-w-[100px] border border-outline-variant/10">
              <Thermometer className="w-5 h-5 text-secondary mb-1 fill-current" />
              <span className="text-[10px] text-on-surface-variant font-medium">{t.detail.humidity}</span>
              <span className="text-sm font-bold text-on-surface">{initialPlant.humidity || t.detail.humidityFallback}</span>
            </div>
          </div>
        </section>

        {/* Care Narrative Section */}
        <section className="px-6 mb-12">
          <h2 className="font-headline text-2xl font-bold mb-4">{t.detail.careEssence}</h2>
          <p className="text-on-surface-variant leading-relaxed mb-6 max-w-2xl">
            {translation.description || t.detail.descriptionFallback}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-low rounded-3xl p-6 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                <Sun className="w-5 h-5 text-on-secondary-container" />
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1">{t.detail.lightReq}</h3>
                <p className="text-xs text-on-surface-variant leading-snug">
                  {t.detail.lightDesc}
                </p>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-3xl p-6 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                <Droplets className="w-5 h-5 text-on-primary-fixed" />
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1">{t.detail.waterCycle}</h3>
                <p className="text-xs text-on-surface-variant leading-snug">
                  {t.detail.waterDesc}
                </p>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-3xl p-6 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center">
                <Leaf className="w-5 h-5 text-on-tertiary-fixed-variant" />
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1">{t.detail.soilFeeding}</h3>
                <p className="text-xs text-on-surface-variant leading-snug">
                  {t.detail.soilDesc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Growth Timeline */}
        <section className="px-6 mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline text-2xl font-bold">{t.detail.historyTitle}</h2>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 text-xs font-bold text-primary px-4 py-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t.detail.addHistory}
            </button>
          </div>
          
          <div className="relative pl-8">
            <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-outline-variant opacity-30"></div>
            <div className="space-y-10">
              {history.length > 0 ? (
                history.map((milestone, idx) => {
                  const isWatering = milestone.event.toLowerCase().includes('water');
                  const isFertilizing = milestone.event.toLowerCase().includes('fertiliz');
                  
                  return (
                    <div key={idx} className="relative">
                      <div className={cn(
                        "absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-surface shadow-sm",
                        isFertilizing ? 'bg-tertiary' : isWatering ? 'bg-primary' : 'bg-secondary'
                      )}></div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
                          {milestone.date}
                        </span>
                        <h4 className={cn(
                          "font-bold",
                          isFertilizing ? 'text-tertiary' : isWatering ? 'text-primary' : 'text-secondary'
                        )}>
                          {milestone.event}
                        </h4>
                        <p className="text-xs text-on-surface-variant">{milestone.description}</p>
                        {milestone.image && (
                          <div className="mt-2 w-32 h-32 rounded-2xl overflow-hidden shadow-sm">
                            <img 
                              src={milestone.image} 
                              alt="Growth milestone" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-on-surface-variant/50 text-sm">
                  {t.calendar.noEvents}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Care Rhythm */}
        <section className="px-6 mb-24">
          <h2 className="font-headline text-lg font-bold mb-4">{t.detail.careRhythm}</h2>
          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/10">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {t.detail.weekDays.map((day, i) => (
                <div key={i} className="text-center text-[10px] font-bold text-on-surface-variant/40">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 14 }).map((_, i) => {
                const day = i + 25 > 30 ? i + 25 - 30 : i + 25;
                const isToday = day === 4;
                const isWatered = day === 1;
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "aspect-square flex items-center justify-center text-xs rounded-full transition-colors",
                      isToday ? "bg-primary text-white font-bold" : 
                      isWatered ? "bg-primary-fixed text-on-primary-fixed font-bold" :
                      "text-on-surface font-medium"
                    )}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Floating Log Button */}
      <div className="fixed bottom-28 left-0 w-full flex justify-center px-6 z-40">
        <button 
          onClick={() => {
            const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            setHistory([{ date: today, event: t.detail.watering, description: 'Quick watering session' }, ...history]);
          }}
          className="flex items-center gap-3 bg-gradient-to-br from-primary to-primary-container text-white px-8 py-4 rounded-full shadow-[0_12px_32px_rgba(26,28,26,0.15)] transition-transform active:scale-95"
        >
          <Droplets className="w-5 h-5 fill-current" />
          <span className="font-bold tracking-tight">{t.detail.logWatering}</span>
        </button>
      </div>

      {/* Add History Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-10 sm:items-center sm:p-0">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="relative w-full max-w-lg bg-surface rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-headline font-bold text-primary">{t.detail.addHistory}</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">{t.detail.event}</label>
                  <input 
                    type="text" 
                    value={newEvent.event}
                    onChange={(e) => setNewEvent({ ...newEvent, event: e.target.value })}
                    placeholder="e.g. Repotted, Fertilized, New Leaf"
                    className="w-full p-4 rounded-2xl bg-surface-container-low border-none text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">{t.detail.date}</label>
                  <input 
                    type="date" 
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-surface-container-low border-none text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">{t.detail.description}</label>
                  <textarea 
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Describe the event..."
                    rows={3}
                    className="w-full p-4 rounded-2xl bg-surface-container-low border-none text-on-surface focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>
                <button 
                  onClick={handleAddHistory}
                  disabled={!newEvent.event || !newEvent.date}
                  className="w-full py-4 rounded-full bg-primary text-on-primary font-bold shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  {t.detail.saveEntry}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
