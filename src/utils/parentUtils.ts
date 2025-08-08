import { LineageData } from '../domain/LineageData';

// Find all parents of a person in the lineage
export function findParents(person: LineageData, allPeople: LineageData[]): LineageData[] {
  if (person.parents.length === 0) return [];

  // Create a map for efficient lookup
  const peopleMap = new Map<string, LineageData>();
  allPeople.forEach(p => peopleMap.set(p.id, p));

  // Return all parents that exist in the data
  return person.parents
    .map(parentId => peopleMap.get(parentId))
    .filter((parent): parent is LineageData => parent !== undefined);
}
