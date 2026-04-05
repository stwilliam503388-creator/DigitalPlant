export interface Plant {
  id: string;
  name: string;
  species: string;
  scientificName?: string;
  location: string;
  image: string;
  waterStreak?: number;
  needsWater?: boolean;
  status?: string;
  light?: string;
  humidity?: string;
  description?: string;
  family?: string;
  wateringFrequency?: number; // in days
  fertilizingFrequency?: number; // in days
  lastWatered?: string; // ISO date string
  lastFertilized?: string; // ISO date string
  history?: {
    date: string;
    event: string;
    description: string;
    image?: string;
  }[];
}

export interface DeadPlant {
  id: string;
  name: string;
  species: string;
  period: string;
  cause: string;
  epitaph: string;
  image: string;
  status: 'Departed' | 'Ascended' | 'Crispy';
}

export type EventType = 'watering' | 'fertilizing' | 'custom';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO string
  type: EventType;
  plantId?: string;
  description?: string;
}
