import React, { useState, useRef } from 'react';
import { X, History, PlusCircle, Search, Info, Scan, BookOpen, Settings as SettingsIcon, Sprout, Sun, Droplets, Camera, Upload, AlertCircle, CheckCircle2, Thermometer, Wind, Shovel, Zap, Sparkles, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

interface IdentificationResult {
  commonName: string;
  scientificName: string;
  confidence: number;
  description: string;
  careTips: {
    light: string;
    watering: string;
    humidity: string;
    soil: string;
    fertilizing: string;
    temperature: string;
  };
  additionalInfo?: {
    toxicity?: string;
    origin?: string;
    growthRate?: string;
    difficulty?: string;
    repotting?: string;
    pruning?: string;
    propagation?: string;
    pests?: string;
    winterCare?: string;
  };
}

export default function Identify() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatePrompt, setGeneratePrompt] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setError(null);
        setShowGenerator(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = async () => {
    if (!generatePrompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: generatePrompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      let imageUrl = '';
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        setSelectedImage(imageUrl);
        setShowGenerator(false);
        setResult(null);
      } else {
        throw new Error('No image generated');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(t.identify.errorIdentifying);
    } finally {
      setIsGenerating(false);
    }
  };

  const identifyPlant = async () => {
    if (!selectedImage) {
      setError(t.identify.noImageSelected);
      return;
    }

    setIsIdentifying(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const base64Data = selectedImage.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: "Identify this plant and provide detailed care information. Return the response in JSON format." },
              { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              commonName: { type: Type.STRING },
              scientificName: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              description: { type: Type.STRING },
              careTips: {
                type: Type.OBJECT,
                properties: {
                  light: { type: Type.STRING },
                  watering: { type: Type.STRING },
                  humidity: { type: Type.STRING },
                  soil: { type: Type.STRING },
                  fertilizing: { type: Type.STRING },
                  temperature: { type: Type.STRING },
                },
                required: ['light', 'watering', 'humidity', 'soil', 'fertilizing', 'temperature']
              },
              additionalInfo: {
                type: Type.OBJECT,
                properties: {
                  toxicity: { type: Type.STRING },
                  origin: { type: Type.STRING },
                  growthRate: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  repotting: { type: Type.STRING },
                  pruning: { type: Type.STRING },
                  propagation: { type: Type.STRING },
                  pests: { type: Type.STRING },
                  winterCare: { type: Type.STRING },
                }
              }
            },
            required: ['commonName', 'scientificName', 'confidence', 'description', 'careTips']
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      setResult(data);
    } catch (err) {
      console.error('Identification error:', err);
      setError(t.identify.errorIdentifying);
    } finally {
      setIsIdentifying(false);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen pb-32">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-6 h-16">
        <button onClick={() => navigate(-1)} className="p-2 hover:opacity-80 transition-opacity active:scale-95">
          <X className="w-6 h-6 text-primary" />
        </button>
        <h1 className="text-xl font-bold text-on-surface font-headline tracking-tight">{t.identify.title}</h1>
        <button className="p-2 hover:opacity-80 transition-opacity active:scale-95">
          <History className="w-6 h-6 text-primary" />
        </button>
      </header>

      <main className="pt-16">
        <section className="relative px-6 pt-4 h-[442px] md:h-[530px] flex flex-col">
          <div className="relative flex-grow overflow-hidden rounded-[2rem] bg-surface-container-highest shadow-inner">
            {selectedImage ? (
              <img 
                className="absolute inset-0 w-full h-full object-cover" 
                src={selectedImage} 
                alt="Selected"
              />
            ) : showGenerator ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-surface-container-low">
                <div className="w-20 h-20 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary mb-4">
                  <Sparkles className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-bold mb-2">{t.identify.generateImage}</h2>
                <p className="text-sm text-on-surface-variant mb-6">{t.identify.generateDesc}</p>
                
                <div className="w-full max-w-xs space-y-4">
                  <textarea 
                    value={generatePrompt}
                    onChange={(e) => setGeneratePrompt(e.target.value)}
                    placeholder={t.identify.generatePlaceholder}
                    className="w-full h-32 p-4 rounded-2xl bg-surface border border-outline-variant focus:border-tertiary focus:ring-0 text-sm resize-none transition-all"
                  />
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowGenerator(false)}
                      className="flex-1 py-3 rounded-2xl bg-surface-container-high text-on-surface font-bold active:scale-95 transition-transform"
                    >
                      {t.calendar.cancel}
                    </button>
                    <button 
                      onClick={generateImage}
                      disabled={isGenerating || !generatePrompt.trim()}
                      className="flex-[2] py-3 rounded-2xl bg-tertiary text-on-tertiary font-bold shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100"
                    >
                      {isGenerating ? t.identify.generating : t.identify.generateImage}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-surface-container-low">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Scan className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-bold mb-2">{t.add.capture}</h2>
                <p className="text-sm text-on-surface-variant mb-8">{t.add.captureDesc}</p>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-on-primary font-bold shadow-lg active:scale-95 transition-transform"
                  >
                    <Camera className="w-5 h-5" />
                    {t.identify.takePhoto}
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-surface-container-high text-on-surface font-bold border border-outline-variant/20 active:scale-95 transition-transform"
                  >
                    <Upload className="w-5 h-5" />
                    {t.identify.uploadImage}
                  </button>
                  <button 
                    onClick={() => setShowGenerator(true)}
                    className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-tertiary-container text-on-tertiary-container font-bold active:scale-95 transition-transform"
                  >
                    <Wand2 className="w-5 h-5" />
                    {t.identify.generateImage}
                  </button>
                </div>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageSelect} 
              accept="image/*" 
              capture="environment"
              className="hidden" 
            />

            {isIdentifying && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-12">
                <div className="relative w-full h-full max-w-sm max-h-sm">
                  <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-primary-fixed rounded-tl-xl"></div>
                  <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-primary-fixed rounded-tr-xl"></div>
                  <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-primary-fixed rounded-bl-xl"></div>
                  <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-primary-fixed rounded-br-xl"></div>
                  <motion.div 
                    animate={{ top: ['10%', '90%', '10%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-0 w-full h-[2px] bg-primary-fixed shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                  />
                </div>
              </div>
            )}

            {isIdentifying && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <div className="bg-surface/90 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 shadow-xl">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-bold tracking-wider text-on-surface uppercase">{t.identify.analyzing}</span>
                </div>
              </div>
            )}

            {selectedImage && !isIdentifying && !result && (
              <div className="absolute bottom-6 left-0 w-full px-6 flex gap-3">
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="flex-1 py-4 rounded-2xl bg-surface/90 backdrop-blur-md text-on-surface font-bold shadow-lg active:scale-95 transition-transform"
                >
                  {t.calendar.cancel}
                </button>
                <button 
                  onClick={identifyPlant}
                  className="flex-[2] py-4 rounded-2xl bg-primary text-on-primary font-bold shadow-lg active:scale-95 transition-transform"
                >
                  {t.identify.identifyButton}
                </button>
              </div>
            )}
          </div>
        </section>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="px-6 mt-4"
            >
              <div className="bg-error-container text-on-error-container p-4 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.section 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 -mt-8 relative z-10"
            >
              <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-[0_12px_32px_rgba(26,28,26,0.06)] border border-outline-variant/10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-container text-[10px] font-bold tracking-widest uppercase mb-3">
                      {t.identify.matchFound} • {Math.round(result.confidence * 100)}%
                    </span>
                    <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tighter mb-1">{result.commonName}</h2>
                    <p className="text-lg italic font-medium text-on-surface-variant font-body">{result.scientificName}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-on-surface-variant mb-8">
                  {result.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-surface-container-low p-4 rounded-2xl flex flex-col items-center text-center">
                    <Sun className="w-5 h-5 text-primary mb-2" />
                    <span className="text-[10px] font-bold uppercase text-outline mb-1">{t.identify.light}</span>
                    <span className="text-xs font-semibold text-on-surface">{result.careTips.light}</span>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-2xl flex flex-col items-center text-center">
                    <Droplets className="w-5 h-5 text-primary mb-2" />
                    <span className="text-[10px] font-bold uppercase text-outline mb-1">{t.identify.watering}</span>
                    <span className="text-xs font-semibold text-on-surface">{result.careTips.watering}</span>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-2xl flex flex-col items-center text-center">
                    <Wind className="w-5 h-5 text-primary mb-2" />
                    <span className="text-[10px] font-bold uppercase text-outline mb-1">{t.identify.humidity}</span>
                    <span className="text-xs font-semibold text-on-surface">{result.careTips.humidity}</span>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-2xl flex flex-col items-center text-center">
                    <Shovel className="w-5 h-5 text-primary mb-2" />
                    <span className="text-[10px] font-bold uppercase text-outline mb-1">{t.identify.soil}</span>
                    <span className="text-xs font-semibold text-on-surface">{result.careTips.soil}</span>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-2xl flex flex-col items-center text-center">
                    <Zap className="w-5 h-5 text-primary mb-2" />
                    <span className="text-[10px] font-bold uppercase text-outline mb-1">{t.identify.fertilizing}</span>
                    <span className="text-xs font-semibold text-on-surface">{result.careTips.fertilizing}</span>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-2xl flex flex-col items-center text-center">
                    <Thermometer className="w-5 h-5 text-primary mb-2" />
                    <span className="text-[10px] font-bold uppercase text-outline mb-1">{t.identify.temp}</span>
                    <span className="text-xs font-semibold text-on-surface">{result.careTips.temperature}</span>
                  </div>
                </div>

                {result.additionalInfo && (
                  <div className="space-y-4 mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-outline px-2">{t.identify.careTips}</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(result.additionalInfo).map(([key, value]) => (
                        <div key={key} className="p-4 rounded-2xl bg-surface-container-low flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <Info className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold uppercase text-outline mb-0.5">
                              {t.identify[key as keyof typeof t.identify] || key}
                            </h4>
                            <p className="text-sm text-on-surface">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => navigate('/add', { state: { plant: result } })}
                    className="w-full h-14 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                  >
                    <PlusCircle className="w-5 h-5" />
                    {t.identify.addToCollection}
                  </button>
                  <button 
                    onClick={() => {
                      setResult(null);
                      setSelectedImage(null);
                    }}
                    className="w-full h-14 rounded-full border border-outline-variant text-on-surface-variant font-bold flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors"
                  >
                    <Scan className="w-5 h-5" />
                    {t.identify.title}
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 w-full h-20 bg-surface/80 backdrop-blur-xl flex justify-around items-center px-4 pb-safe rounded-t-[1.5rem] z-50 shadow-[0_-12px_32px_rgba(26,28,26,0.06)]">
        <button onClick={() => navigate('/')} className="flex flex-col items-center justify-center text-on-surface/70 hover:text-primary transition-all">
          <Sprout className="w-6 h-6" />
          <span className="text-[11px] font-medium mt-1">{t.nav.garden}</span>
        </button>
        <button className="flex items-center justify-center bg-gradient-to-br from-primary to-primary-container text-white rounded-full w-12 h-12 mb-1 shadow-lg active:scale-90 transition-transform">
          <Scan className="w-6 h-6" />
        </button>
        <button onClick={() => navigate('/calendar')} className="flex flex-col items-center justify-center text-on-surface/70 hover:text-primary transition-all">
          <BookOpen className="w-6 h-6" />
          <span className="text-[11px] font-medium mt-1">{t.nav.calendar}</span>
        </button>
        <button onClick={() => navigate('/settings')} className="flex flex-col items-center justify-center text-on-surface/70 hover:text-primary transition-all">
          <SettingsIcon className="w-6 h-6" />
          <span className="text-[11px] font-medium mt-1">{t.nav.settings}</span>
        </button>
      </nav>
    </div>
  );
}
