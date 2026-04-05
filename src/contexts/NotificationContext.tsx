import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';
import { PLANTS } from '../constants';

interface NotificationContextType {
  notificationsEnabled: boolean;
  requestPermission: () => Promise<void>;
  toggleNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('notificationsEnabled') === 'true';
  });

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      console.error('This browser does not support desktop notification');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      localStorage.setItem('notificationsEnabled', 'true');
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('notificationsEnabled', 'false');
    }
  };

  const toggleNotifications = () => {
    if (!notificationsEnabled) {
      requestPermission();
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('notificationsEnabled', 'false');
    }
  };

  useEffect(() => {
    if (!notificationsEnabled) return;

    const checkSchedules = () => {
      const now = new Date();
      PLANTS.forEach(plant => {
        if (plant.wateringFrequency && plant.lastWatered) {
          const lastWatered = new Date(plant.lastWatered);
          const nextWatering = new Date(lastWatered.getTime() + plant.wateringFrequency * 24 * 60 * 60 * 1000);
          
          if (now >= nextWatering) {
            new Notification(t.notifications.wateringTitle, {
              body: t.notifications.wateringBody.replace('{name}', plant.name),
              icon: plant.image,
            });
          }
        }

        if (plant.fertilizingFrequency && plant.lastFertilized) {
          const lastFertilized = new Date(plant.lastFertilized);
          const nextFertilizing = new Date(lastFertilized.getTime() + plant.fertilizingFrequency * 24 * 60 * 60 * 1000);
          
          if (now >= nextFertilizing) {
            new Notification(t.notifications.fertilizingTitle, {
              body: t.notifications.fertilizingBody.replace('{name}', plant.name),
              icon: plant.image,
            });
          }
        }
      });
    };

    // Check once on mount
    checkSchedules();

    // Check every hour
    const interval = setInterval(checkSchedules, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [notificationsEnabled, t]);

  return (
    <NotificationContext.Provider value={{ notificationsEnabled, requestPermission, toggleNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
