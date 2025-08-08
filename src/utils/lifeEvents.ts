import { eventsData, LineageData } from '../domain/LineageData';
import { Event } from '../domain/EventsData';
import { CharacterEventData, characterEventsData } from '../domain/CharacterEventsData';
import { PersonNodeData } from "../components/PersonNodeComponent";

// Estimate lifespan for a person based on available data
export function estimateLifespan(person: LineageData, allPeople: LineageData[]): {
  birthYearAM: number;
  deathYearAM: number
} {
  let birthYearAM: number;
  let deathYearAM: number;

  // If we have birth year, use it directly (already in AM format)
  if (person.birthYear !== null && person.birthYear !== undefined) {
    birthYearAM = person.birthYear;
  } else {
    // Estimate based on parent or position in chronology
    birthYearAM = estimateBirthYear(person, allPeople);
  }

  // If we have age at death, calculate death year
  if (person.ageAtDeath !== null && person.ageAtDeath !== undefined) {
    deathYearAM = birthYearAM + person.ageAtDeath;
  } else {
    // Estimate death year (average biblical lifespan varies by era)
    const estimatedLifespan = estimateLifespanByEra(birthYearAM);
    deathYearAM = birthYearAM + estimatedLifespan;
  }

  return {birthYearAM, deathYearAM};
}

// Estimate birth year based on parent or chronological position
function estimateBirthYear(person: LineageData, allPeople: LineageData[]): number {
  // Try to find parent information
  const parent = findParent(person, allPeople);

  if (parent && parent.birthYear !== null && parent.birthYear !== undefined) {
    // Parent's birth year is already in AM format
    const parentBirthAM = parent.birthYear;
    // Assume average age of first child is 30-50 years in biblical times
    return parentBirthAM + 35;
  }

  // If no parent info, use rough chronological estimates based on name/position
  if (person.name === 'Adam') return 0;
  if (person.name === 'Seth') return 130;
  if (person.name === 'Enos') return 235;
  if (person.name === 'Cainan') return 325;
  if (person.name === 'Mahalaleel') return 395;
  if (person.name === 'Jared') return 460;
  if (person.name === 'Enoch') return 622;
  if (person.name === 'Methuselah') return 687;
  if (person.name === 'Lamech') return 874;
  if (person.name === 'Noah') return 1056;

  // Default fallback - place after known genealogy
  return 1500;
}

// Find parent of a person in the lineage - updated for flat array structure
function findParent(person: LineageData, allPeople: LineageData[]): LineageData | null {
  if (person.parents.length === 0) return null;

  // Get the first parent (father) - create a map for efficient lookup
  const peopleMap = new Map<string, LineageData>();
  allPeople.forEach(p => peopleMap.set(p.id, p));

  return peopleMap.get(person.parents[0]) || null;
}

// Estimate lifespan based on biblical era
function estimateLifespanByEra(birthYearAM: number): number {
  if (birthYearAM < 1656) { // Before the flood
    return 800; // Pre-flood people lived very long lives
  } else if (birthYearAM < 2000) { // Post-flood to Abraham
    return 400; // Gradually decreasing lifespans
  } else if (birthYearAM < 2500) { // Patriarchal period
    return 150; // Still long but more moderate
  } else {
    return 70; // Later biblical period
  }
}

// Get all people from lineage data - updated for flat array structure
export function getAllPeople(data: LineageData[]): LineageData[] {
  // Data is already a flat array, so just return it
  return data;
}

// Find events that occurred during a person's lifetime
export function getLifeEvents(person: PersonNodeData, allPeople: LineageData[]): Event[] {
  const {birthYearAM, deathYearAM} = estimateLifespan(person, allPeople);

  return eventsData.filter(event => {
    const eventYear = event.dateAM;
    return eventYear >= birthYearAM && eventYear <= deathYearAM;
  });
}

// Get personal events for a specific person
export function getPersonalEvents(person: PersonNodeData): CharacterEventData[] {
  return characterEventsData.filter(event =>
    event.personId === person.id ||
    event.personId === person.name ||
    (event.relatedPersonIds && event.relatedPersonIds.includes(person.id)) ||
    (event.relatedPersonIds && event.relatedPersonIds.includes(person.name))
  );
}
