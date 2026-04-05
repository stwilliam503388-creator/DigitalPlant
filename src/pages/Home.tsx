import React, { useState, useMemo } from 'react';
import { Droplets, Sun, AlertCircle, CheckCircle2, Leaf, Plus, BarChart2, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PLANTS } from '../constants';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  
  const getPlantTranslation = (id: string) => {
    switch (id) {
      case '1': return t.plants.fiddleLeaf;
      case '2': return t.plants.monstera;
      case '3': return t.plants.snakePlant;
      case '4': return t.plants.goldenPothos;
      default: return t.plants.fiddleLeaf;
    }
  };

  const filteredPlants = useMemo(() => {
    if (!searchQuery.trim()) return PLANTS;
    
    const query = searchQuery.toLowerCase();
    return PLANTS.filter(plant => {
      const translation = getPlantTranslation(plant.id);
      return (
        translation.name.toLowerCase().includes(query) ||
        (translation.scientificName?.toLowerCase() ?? '').includes(query) ||
        translation.species.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, t]);

  const featuredPlant = filteredPlants.length > 0 ? filteredPlants[0] : null;
  const featuredTranslation = featuredPlant ? getPlantTranslation(featuredPlant.id) : null;
  const otherPlants = filteredPlants.slice(1);

  return (
    <div className="px-6 pt-6 pb-32 max-w-7xl mx-auto">
      {/* Hero Editorial Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="font-label text-sm uppercase tracking-widest text-on-surface-variant opacity-70 mb-2 block">
              {t.home.springCollection}
            </span>
            <h2 className="font-headline text-5xl md:text-7xl font-extrabold text-primary leading-none tracking-tighter">
              {t.home.title}
            </h2>
            <Link 
              to="/compare"
              className="mt-4 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-surface-container-high text-primary font-bold text-sm hover:bg-surface-container-highest transition-colors"
            >
              <BarChart2 className="w-4 h-4" />
              {t.compare.title}
            </Link>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl max-w-xs">
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {t.home.subtitle}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.home.searchPlaceholder}
            className="w-full pl-12 pr-12 py-4 bg-surface-container-low border-none rounded-2xl text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-surface-container-high rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-on-surface-variant" />
            </button>
          )}
        </div>
      </motion.section>

      {/* Dynamic Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {featuredPlant && (
            <motion.div 
              key={featuredPlant.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-2 bg-surface-container-lowest rounded-3xl overflow-hidden group shadow-sm flex flex-col md:flex-row h-full border border-outline-variant/10"
            >
              <div className="md:w-1/2 relative overflow-hidden aspect-[4/5] md:aspect-auto">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src={featuredPlant.image} 
                  alt={featuredTranslation?.name}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium">
                  <Droplets className="w-3 h-3 fill-current" />
                  {featuredPlant.waterStreak} {t.detail.daysStreak}
                </div>
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-headline text-3xl font-bold text-primary">{featuredTranslation?.name}</h3>
                    <span className="bg-secondary-container text-on-secondary-container text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter">
                      {featuredTranslation?.scientificName}
                    </span>
                  </div>
                  <p className="text-on-surface-variant mb-6 leading-relaxed">
                    {featuredTranslation?.description}
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                        <Sun className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface">{t.detail.light}</p>
                        <p className="text-xs text-on-surface-variant">{featuredPlant.light || t.detail.indirect}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="mt-8 w-full py-4 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-all active:scale-95">
                  <Droplets className="w-5 h-5" />
                  {t.home.logWatering}
                </button>
              </div>
            </motion.div>
          )}

          {otherPlants.map((plant, index) => {
            const translation = getPlantTranslation(plant.id);
            return (
              <motion.div
                key={plant.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-surface-container-lowest rounded-3xl p-4 flex flex-col group border border-outline-variant/10 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
              >
                <Link to={`/plant/${plant.id}`} className="relative rounded-2xl overflow-hidden mb-4 aspect-[4/5]">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    src={plant.image} 
                    alt={translation.name}
                    referrerPolicy="no-referrer"
                  />
                  {plant.needsWater && (
                    <div className="absolute bottom-3 left-3 bg-tertiary-container text-tertiary-fixed px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold tracking-tight">
                      <AlertCircle className="w-3 h-3" />
                      {t.home.needsWater}
                    </div>
                  )}
                  {plant.status === 'Vitals Stable' && (
                    <div className="absolute bottom-3 left-3 bg-secondary-fixed text-on-secondary-fixed px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold tracking-tight">
                      <CheckCircle2 className="w-3 h-3" />
                      {t.home.vitals}
                    </div>
                  )}
                  {plant.status === 'New Growth' && (
                    <div className="absolute bottom-3 left-3 bg-primary-fixed text-on-primary-fixed px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold tracking-tight">
                      <Leaf className="w-3 h-3" />
                      {t.home.newGrowth}
                    </div>
                  )}
                </Link>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-headline font-bold text-lg text-primary">{translation.name}</h4>
                  <div className="flex items-center text-primary/40">
                    <Droplets className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold ml-0.5">{plant.waterStreak}</span>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant mb-2">{translation.location}</p>
              </motion.div>
            );
          })}

          {filteredPlants.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center"
            >
              <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-4 text-on-surface-variant/30">
                <Search className="w-10 h-10" />
              </div>
              <p className="text-on-surface-variant font-medium">{t.home.noResults}</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-primary font-bold text-sm hover:underline"
              >
                {t.compare.clear}
              </button>
            </motion.div>
          )}

          {/* Empty/Add State Design */}
          {!searchQuery && (
            <motion.div 
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center border-2 border-dashed border-outline-variant rounded-3xl p-8 aspect-square md:aspect-auto"
            >
              <Link to="/add" className="text-center group">
                <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity">
                  <Plus className="w-8 h-8" />
                </div>
                <p className="font-headline font-bold text-primary opacity-60 group-hover:opacity-100">{t.home.expandJungle}</p>
                <p className="text-xs text-on-surface-variant mt-2">{t.home.discoverSpecies}</p>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
