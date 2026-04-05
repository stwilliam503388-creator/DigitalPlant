import React from 'react';
import { Skull, Sprout } from 'lucide-react';
import { motion } from 'motion/react';
import { DEAD_PLANTS } from '../constants';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

export default function Graveyard() {
  const { t } = useLanguage();

  const getPlantTranslation = (id: string) => {
    switch (id) {
      case 'd1': return t.plants.barnaby;
      case 'd2': return t.plants.unnamedSucculent;
      case 'd3': return t.plants.delilah;
      default: return t.plants.barnaby;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pt-8 pb-32">
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="font-headline text-[3.5rem] leading-[1.1] font-extrabold tracking-tighter text-on-surface mb-2">
          {t.graveyard.title}
        </h2>
        <p className="font-body text-on-surface-variant max-w-xl text-lg leading-relaxed">
          {t.graveyard.subtitle}
        </p>
      </motion.section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-8 flex flex-col gap-12">
          {DEAD_PLANTS.map((plant, index) => {
            const translation = getPlantTranslation(plant.id);
            return (
              <motion.div 
                key={plant.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "group relative flex flex-col gap-6 items-center",
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                <div className="w-full md:w-64 h-80 rounded-xl overflow-hidden bg-surface-container-low shadow-sm">
                  <img 
                    src={plant.image} 
                    alt={translation.name} 
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className={cn(
                  "flex-1 space-y-4",
                  index % 2 !== 0 && "md:text-right"
                )}>
                  <div className={cn(
                    "flex items-center gap-2 text-tertiary font-medium",
                    index % 2 !== 0 && "md:justify-end"
                  )}>
                    <Skull className="w-4 h-4" />
                    <span className="font-label text-xs tracking-widest uppercase">{translation.status}</span>
                  </div>
                  <h3 className="font-headline text-3xl font-bold tracking-tight">{translation.name}</h3>
                  <div className={cn(
                    "flex flex-wrap gap-2",
                    index % 2 !== 0 && "md:justify-end"
                  )}>
                    <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-xs font-medium rounded-full">
                      {plant.period}
                    </span>
                    <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container text-xs font-medium rounded-full">
                      {translation.cause}
                    </span>
                  </div>
                  <p className="text-on-surface-variant leading-relaxed font-light italic">
                    {translation.epitaph}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <aside className="md:col-span-4 sticky top-28 space-y-8">
          <div className="p-8 rounded-xl bg-surface-container-low border border-outline-variant/10">
            <h4 className="font-headline text-xl font-bold mb-4">{t.graveyard.stats}</h4>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-outline-variant pb-2">
                <span className="text-on-surface-variant font-label text-sm uppercase">{t.graveyard.totalLosses}</span>
                <span className="font-headline text-3xl font-bold text-tertiary">14</span>
              </div>
              <div className="flex justify-between items-end border-b border-outline-variant pb-2">
                <span className="text-on-surface-variant font-label text-sm uppercase">{t.graveyard.deadliestSeason}</span>
                <span className="font-headline text-xl font-bold">{t.graveyard.winter}</span>
              </div>
              <div className="flex justify-between items-end border-b border-outline-variant pb-2">
                <span className="text-on-surface-variant font-label text-sm uppercase">{t.graveyard.survivalRate}</span>
                <span className="font-headline text-xl font-bold">62%</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-xl bg-primary text-on-primary">
            <Sprout className="w-10 h-10 mb-4" />
            <h4 className="font-headline text-xl font-bold mb-2">{t.graveyard.tryAgain}</h4>
            <p className="font-body text-sm text-on-primary/80 mb-6">
              {t.graveyard.tryAgainDesc}
            </p>
            <button className="w-full bg-gradient-to-br from-secondary-fixed to-primary-fixed text-primary font-bold py-3 px-6 rounded-full transition-transform active:scale-95">
              {t.graveyard.addNew}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
