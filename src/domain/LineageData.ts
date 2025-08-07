import AdamLineage from '../data-source/lineage.json';
import EventsJson from '../data-source/events.json';
import { Event } from './EventsData';

export const lineageData = AdamLineage;
export const eventsData: Event[] = EventsJson;

// make a type for lineage data that is a subset of the AdamLineage type
export type LineageData = {
  id: string; // unique identifier for the person, can be name or a unique ID
  name: string;
  birthYear?: number | null;
  ageAtDeath?: number | null;
  partner?: string | null;
  children?: LineageData[];
  [key: string]: any; // allow additional properties
};
