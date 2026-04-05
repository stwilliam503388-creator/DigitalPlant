import React, { useState } from 'react';
import { ArrowLeft, X, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PLANTS } from '../constants';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

export default function Compare() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const togglePlant = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    );
  };

  const selectedPlants = PLANTS.filter(p => selectedIds.includes(p.id));

  const getPlantTranslation = (id: string) => {
    switch (id) {
      case '1': return t.plants.fiddleLeaf;
      case '2': return t.plants.monstera;
      case '3': return t.plants.snakePlant;
      case '4': return t.plants.goldenPothos;
      default: return t.plants.fiddleLeaf;
    }
  };

  const compareFields = [
    { label: t.compare.name, key: 'name', isTranslation: true },
    { label: t.compare.species, key: 'species', isTranslation: true },
    { label: t.compare.light, key: 'light', isTranslation: false },
    { label: t.compare.water, key: 'wateringFrequency', isTranslation: false, suffix: ` ${t.add.daily}` },
    { label: t.compare.humidity, key: 'humidity', isTranslation: false },
    { label: t.compare.location, key: 'location', isTranslation: true },
  ];

  return (
    <div className="min-h-screen bg-surface pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-on-surface" />
            </button>
            <div>
              <h1 className="font-headline text-xl font-bold text-primary">{t.compare.title}</h1>
              <p className="text-xs text-on-surface-variant">{t.compare.subtitle}</p>
            </div>
          </div>
          {selectedIds.length > 0 && (
            <button 
              onClick={() => setSelectedIds([])}
              className="text-xs font-bold text-primary hover:underline"
            >
              {t.compare.clear}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Selection Grid */}
        <section className="mb-12">
          <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-6">
            {t.compare.selectPlants}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {PLANTS.map(plant => {
              const translation = getPlantTranslation(plant.id);
              const isSelected = selectedIds.includes(plant.id);
              return (
                <button
                  key={plant.id}
                  onClick={() => togglePlant(plant.id)}
                  className={cn(
                    "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300",
                    isSelected ? "border-primary ring-4 ring-primary/10" : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <img 
                    src={plant.image} 
                    alt={translation.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className={cn(
                    "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
                    isSelected ? "bg-primary/20 opacity-100" : "bg-black/20 opacity-0"
                  )}>
                    {isSelected && (
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-[10px] font-bold text-white truncate">{translation.name}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Comparison Table */}
        <AnimatePresence mode="wait">
          {selectedPlants.length > 0 ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="overflow-x-auto rounded-3xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm"
            >
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/10">
                    <th className="p-6 text-left bg-surface-container-low/30 min-w-[140px]">
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                        {t.compare.name}
                      </span>
                    </th>
                    {selectedPlants.map(plant => (
                      <th key={plant.id} className="p-6 text-center min-w-[200px]">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                            <img 
                              src={plant.image} 
                              alt={plant.name} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <span className="font-headline font-bold text-primary">
                            {getPlantTranslation(plant.id).name}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareFields.map((field, idx) => (
                    <tr 
                      key={field.key} 
                      className={cn(
                        "border-b border-outline-variant/5 transition-colors hover:bg-surface-container-low/20",
                        idx === compareFields.length - 1 && "border-b-0"
                      )}
                    >
                      <td className="p-6 bg-surface-container-low/30">
                        <span className="text-sm font-bold text-on-surface">
                          {field.label}
                        </span>
                      </td>
                      {selectedPlants.map(plant => {
                        const translation = getPlantTranslation(plant.id);
                        let value = field.isTranslation 
                          ? (translation as any)[field.key] 
                          : (plant as any)[field.key];
                        
                        if (field.key === 'wateringFrequency' && value) {
                          value = `${value}${field.suffix}`;
                        }

                        return (
                          <td key={plant.id} className="p-6 text-center">
                            <span className="text-sm text-on-surface-variant font-medium">
                              {value || '—'}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-surface-container-low/20 rounded-3xl border-2 border-dashed border-outline-variant/30"
            >
              <Plus className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" />
              <p className="text-on-surface-variant font-medium">{t.compare.selectPlants}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
