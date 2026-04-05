import React, { useState, useEffect } from 'react';
import { X, Camera, Search, Droplets, Sun, Thermometer, Info, ArrowRight, Sprout, Skull, PlusCircle, BookOpen, CheckCircle2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

export default function AddPlant() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  const identifiedPlant = location.state?.plant;
  
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [frequency, setFrequency] = useState(7);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (identifiedPlant) {
      setName(identifiedPlant.commonName || '');
      setSpecies(identifiedPlant.scientificName || '');
      
      // Try to parse watering frequency from the string
      const waterStr = identifiedPlant.careTips?.watering?.toLowerCase() || '';
      if (waterStr.includes('daily')) setFrequency(1);
      else if (waterStr.includes('2-3 days')) setFrequency(3);
      else if (waterStr.includes('week')) setFrequency(7);
      else if (waterStr.includes('2 weeks')) setFrequency(14);
    }
  }, [identifiedPlant]);

  return (
    <div className="max-w-xl mx-auto px-6 pt-8 pb-32">
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4 max-w-xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-surface-container-low transition-colors rounded-full"
          >
            <X className="w-6 h-6 text-primary" />
          </button>
          <h1 className="font-headline font-bold text-xl text-primary">{t.add.title}</h1>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9AShP9Jci4dOfSB32PldaOzg_FAn0-PlYsdajbJFxqVxxfzCGtMNx6p8sEDOlbv35wBF1b2gdBtL9-rwHwevWwvmej5l34xSsgDsuASEr6llo_7h5EV_0iSNtLzp0ioKJntlt41XCwUzveEIZfcjbgQ2c1MEw4qsbMfpSIohxGvrZJaILDV0P2m_ExRNp6Sc6duep0RwdV6n2_yBH3RirU4WcTgFo9LbKFWwmPNJGpYTgWVhIRr-F-hZziGLDnCLCFnSzWT_bUtg" 
              alt="Profile"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      <main className="pt-16 space-y-12">
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-primary to-primary-container"></div>
          <div className="h-1.5 flex-1 rounded-full bg-surface-container-highest"></div>
          <div className="h-1.5 flex-1 rounded-full bg-surface-container-highest"></div>
        </div>

        <section className="relative group">
          <div className={cn(
            "aspect-[4/5] w-full rounded-3xl bg-surface-container-low flex flex-col items-center justify-center border-2 border-dashed border-outline-variant overflow-hidden hover:border-primary transition-colors duration-300",
            identifiedPlant && "border-solid border-primary/30"
          )}>
            {identifiedPlant ? (
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-5 h-5 text-primary-fixed" />
                    <span className="text-sm font-bold uppercase tracking-widest">{t.identify.matchFound}</span>
                  </div>
                  <button 
                    onClick={() => navigate('/identify')}
                    className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                <img 
                  src="https://picsum.photos/seed/identified/800/1000" 
                  alt="Identified"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-sm">
                  <Camera className="w-10 h-10 fill-current" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-on-surface mb-1">{t.add.capture}</h2>
                  <p className="text-sm text-on-surface-variant font-medium">{t.add.captureDesc}</p>
                </div>
                <button 
                  onClick={() => navigate('/identify')}
                  className="mt-4 px-8 py-3 rounded-full bg-primary text-on-primary font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  {t.add.openCamera}
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-8">
          <div className="space-y-6">
            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">{t.add.plantName}</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-0 py-4 bg-transparent border-t-0 border-x-0 border-b-2 border-surface-container-highest focus:border-primary focus:ring-0 text-xl font-medium placeholder:text-outline-variant transition-all"
                placeholder={t.add.namePlaceholder}
              />
            </div>
            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">{t.add.species}</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  className="w-full px-0 py-4 bg-transparent border-t-0 border-x-0 border-b-2 border-surface-container-highest focus:border-primary focus:ring-0 text-xl font-medium placeholder:text-outline-variant transition-all"
                  placeholder={t.add.searchPlaceholder}
                />
                <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-on-surface-variant" />
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-[2rem] space-y-8">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-on-surface">{t.add.wateringFreq}</h3>
                <p className="text-sm text-on-surface-variant">{t.add.thirstLevel}</p>
              </div>
              <div className="bg-tertiary-container/20 text-on-tertiary-container px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                {frequency <= 3 ? t.add.highNeed : frequency <= 7 ? t.add.active : t.add.minimal}
              </div>
            </div>
            <div className="relative pt-6 pb-2">
              <input 
                type="range" 
                min="1" 
                max="14" 
                value={frequency}
                onChange={(e) => setFrequency(parseInt(e.target.value))}
                className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between mt-4">
                <div className="text-center">
                  <span className={cn("block text-xl font-bold", frequency <= 2 ? "text-primary" : "text-outline-variant")}>{t.add.daily}</span>
                  <span className="text-[10px] font-bold uppercase text-outline">{t.add.constant}</span>
                </div>
                <div className="text-center">
                  <span className={cn("block text-xl font-bold", frequency > 2 && frequency <= 7 ? "text-primary" : "text-outline-variant")}>{t.add.every3Days}</span>
                  <span className="text-[10px] font-bold uppercase text-outline">{t.add.active}</span>
                </div>
                <div className="text-center">
                  <span className={cn("block text-xl font-bold", frequency > 7 ? "text-primary" : "text-outline-variant")}>{t.add.biWeekly}</span>
                  <span className="text-[10px] font-bold uppercase text-outline">{t.add.minimal}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
          <div className={cn(
            "min-w-[140px] p-4 rounded-2xl flex flex-col justify-between aspect-square transition-colors",
            identifiedPlant ? "bg-primary/10 text-primary" : "bg-secondary-container text-on-secondary-container"
          )}>
            <Sun className="w-6 h-6" />
            <span className="text-xs font-bold leading-tight">{identifiedPlant?.careTips?.light || t.add.indirectSun}</span>
          </div>
          <div className={cn(
            "min-w-[140px] p-4 rounded-2xl flex flex-col justify-between aspect-square transition-colors",
            identifiedPlant ? "bg-primary/10 text-primary" : "bg-tertiary-fixed text-on-tertiary-fixed-variant"
          )}>
            <Thermometer className="w-6 h-6" />
            <span className="text-xs font-bold leading-tight">{identifiedPlant?.careTips?.temperature || t.add.warmEnv}</span>
          </div>
          <div className={cn(
            "min-w-[140px] p-4 rounded-2xl flex flex-col justify-between aspect-square transition-colors",
            identifiedPlant ? "bg-primary/10 text-primary" : "bg-surface-container-highest text-on-surface-variant"
          )}>
            <Info className="w-6 h-6" />
            <span className="text-xs font-bold leading-tight">{identifiedPlant?.careTips?.humidity || t.add.checkSoil}</span>
          </div>
        </div>

        <div className="pt-4">
          <button 
            onClick={() => navigate('/')}
            className="w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            <span>{t.add.continue}</span>
            <ArrowRight className="w-6 h-6" />
          </button>
          <p className="text-center text-xs text-on-surface-variant mt-6 font-medium">
            {t.add.editLater}
          </p>
        </div>
      </main>
    </div>
  );
}
