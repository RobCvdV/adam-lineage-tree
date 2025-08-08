import AdamLineage from '../data-source/lineage.json';
import EventsJson from '../data-source/events.json';
import { Event } from './EventsData';

export const lineageData = AdamLineage;
export const eventsData: Event[] = EventsJson;

// Updated type for flat lineage data structure
export type LineageData = {
  id: string;
  name: string;
  birthYear?: number | null;
  ageAtDeath?: number | null;
  partners: string[];
  parents: string[];
  children: string[];
  comment: string;
  [key: string]: any; // allow additional properties
};
