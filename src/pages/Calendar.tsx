import React, { useState, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  parseISO,
  isToday
} from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Droplets, 
  Zap, 
  Calendar as CalendarIcon,
  X,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { PLANTS } from '../constants';
import { CalendarEvent, EventType } from '../types';
import { cn } from '../lib/utils';

export default function Calendar() {
  const { t, language } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>([]);
  
  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<EventType>('custom');
  const [newDesc, setNewDesc] = useState('');

  // Generate scheduled events based on plant data
  const scheduledEvents = useMemo(() => {
    const events: CalendarEvent[] = [];
    const startDate = startOfMonth(currentMonth);
    const endDate = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    PLANTS.forEach(plant => {
      // Watering events
      if (plant.wateringFrequency && plant.lastWatered) {
        let nextWater = parseISO(plant.lastWatered);
        // Project forward for 3 months to ensure we cover current view
        for (let i = 0; i < 20; i++) {
          nextWater = addDays(nextWater, plant.wateringFrequency);
          if (nextWater >= startDate && nextWater <= endDate) {
            events.push({
              id: `w-${plant.id}-${nextWater.getTime()}`,
              title: `${plant.name}: ${t.calendar.watering}`,
              date: nextWater.toISOString(),
              type: 'watering',
              plantId: plant.id
            });
          }
          if (nextWater > endDate) break;
        }
      }

      // Fertilizing events
      if (plant.fertilizingFrequency && plant.lastFertilized) {
        let nextFert = parseISO(plant.lastFertilized);
        for (let i = 0; i < 10; i++) {
          nextFert = addDays(nextFert, plant.fertilizingFrequency);
          if (nextFert >= startDate && nextFert <= endDate) {
            events.push({
              id: `f-${plant.id}-${nextFert.getTime()}`,
              title: `${plant.name}: ${t.calendar.fertilizing}`,
              date: nextFert.toISOString(),
              type: 'fertilizing',
              plantId: plant.id
            });
          }
          if (nextFert > endDate) break;
        }
      }
    });

    return [...events, ...customEvents];
  }, [currentMonth, customEvents, t]);

  const selectedDateEvents = scheduledEvents.filter(event => 
    isSameDay(parseISO(event.date), selectedDate)
  );

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">
            {format(currentMonth, 'MMMM yyyy')}
          </h1>
          <p className="text-sm text-on-surface-variant">{t.calendar.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-[10px] font-bold text-on-surface-variant uppercase tracking-widest py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const hasEvents = scheduledEvents.some(e => isSameDay(parseISO(e.date), cloneDay));
        const isSel = isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isTod = isToday(day);

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "relative aspect-square flex flex-col items-center justify-center cursor-pointer transition-all duration-200 rounded-2xl m-1",
              !isCurrentMonth ? "text-on-surface-variant/20" : "text-on-surface",
              isSel ? "bg-primary text-on-primary shadow-lg scale-105 z-10" : "hover:bg-surface-container-high",
              isTod && !isSel && "border-2 border-primary/30"
            )}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <span className="text-sm font-bold">{formattedDate}</span>
            {hasEvents && !isSel && (
              <div className="absolute bottom-2 flex gap-0.5">
                <div className="w-1 h-1 rounded-full bg-primary" />
              </div>
            )}
            {isTod && !isSel && (
              <span className="absolute top-1 text-[8px] font-bold text-primary uppercase">
                {t.calendar.today}
              </span>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="bg-surface-container-lowest rounded-3xl p-2 border border-outline-variant/10 shadow-sm">{rows}</div>;
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: CalendarEvent = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      date: selectedDate.toISOString(),
      type: newType,
      description: newDesc
    };
    setCustomEvents([...customEvents, newEvent]);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="min-h-screen bg-surface pb-32">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderHeader()}
        {renderDays()}
        {renderCells()}

        {/* Selected Day Events */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-headline font-bold text-on-surface">
                  {format(selectedDate, 'EEEE, MMMM do')}
                </h2>
                <p className="text-xs text-on-surface-variant">
                  {selectedDateEvents.length} {selectedDateEvents.length === 1 ? 'event' : 'events'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map(event => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/10 flex items-center gap-4 group hover:bg-surface-container-high transition-colors"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm",
                      event.type === 'watering' ? "bg-blue-100 text-blue-600" :
                      event.type === 'fertilizing' ? "bg-amber-100 text-amber-600" :
                      "bg-primary/10 text-primary"
                    )}>
                      {event.type === 'watering' ? <Droplets className="w-6 h-6" /> :
                       event.type === 'fertilizing' ? <Zap className="w-6 h-6" /> :
                       <CalendarIcon className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-on-surface">{event.title}</h3>
                      {event.description && (
                        <p className="text-xs text-on-surface-variant mt-0.5">{event.description}</p>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 bg-surface-container-low/30 rounded-3xl border-2 border-dashed border-outline-variant/20"
                >
                  <p className="text-on-surface-variant text-sm">{t.calendar.noEvents}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-surface rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-headline font-bold text-primary">{t.calendar.addEvent}</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-full hover:bg-surface-container-high transition-colors"
                >
                  <X className="w-6 h-6 text-on-surface-variant" />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                    {t.calendar.eventTitle}
                  </label>
                  <input 
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="e.g., Repotting"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                    {t.calendar.eventType}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['watering', 'fertilizing', 'custom'] as EventType[]).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewType(type)}
                        className={cn(
                          "py-3 rounded-xl text-xs font-bold border-2 transition-all",
                          newType === type 
                            ? "border-primary bg-primary/10 text-primary" 
                            : "border-outline-variant/10 text-on-surface-variant hover:border-outline-variant/30"
                        )}
                      >
                        {t.calendar[type as keyof typeof t.calendar]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                    {t.calendar.eventDescription}
                  </label>
                  <textarea 
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none h-24"
                    placeholder="Optional details..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 rounded-2xl bg-primary text-on-primary font-bold shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {t.calendar.saveEvent}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
