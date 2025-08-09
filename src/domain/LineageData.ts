import lineageJson from '../data-source/lineage.json';
import EventsJson from '../data-source/events.json';
import { Event } from './EventsData';

export const lineageData: LineageData[] = lineageJson;
export const eventsData: Event[] = EventsJson;

// Domain model for lineage data
export interface LineageData {
  id: string;
  name: string;
  birthYear: number | null;
  ageAtDeath: number | null;
  partners: string[];
  parents: string[];
  children: string[];
  comment?: string;

  [key: string]: any; // Allow additional properties
}

export function getPersonData(personId: string): LineageData | undefined {
  return lineageData.find(person => person.id === personId);
}
