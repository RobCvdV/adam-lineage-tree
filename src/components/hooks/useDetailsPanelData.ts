import { useMemo } from 'react';
import { PersonNodeData } from '../PersonNodeComponent';
import { getSimpleValue } from '../../utils/isSimpleValue';
import { DetailItem } from '../DetailList';
import { getAllPeople, getLifeEvents, getPersonalEvents } from '../../utils/lifeEvents';
import { lineageData, LineageData } from '../../domain/LineageData';

const OMITTED_KEYS = ['name', 'selected', 'highlighted', 'generation', 'parent', 'children', 'parents', 'partners', 'id'];

export const useDetailsPanelData = (nodeData: PersonNodeData | null) => {
  return useMemo(() => {
    if (!nodeData) {
      return {
        detailItems: [],
        children: [],
        parentData: null,
        lifeEvents: [],
        personalEvents: []
      };
    }

    // Create a lookup map for easy access to people by ID
    const peopleMap = new Map<string, LineageData>();
    lineageData.forEach(person => {
      peopleMap.set(person.id, person);
    });

    const detailItems: DetailItem[] = Object.entries(nodeData)
      .filter(([key]) => !OMITTED_KEYS.includes(key))
      .map(([key, value]) => ({key, value: getSimpleValue(value, '-')}));

    // Get children data by looking up their IDs
    const children: LineageData[] = nodeData.children ?
                                    nodeData.children.map(childId => peopleMap.get(childId)).filter(Boolean) as LineageData[] :
      [];

    // Get parent data (use first parent as primary parent for backward compatibility)
    const parentData: LineageData | null = nodeData.parents && nodeData.parents.length > 0 ?
                                           peopleMap.get(nodeData.parents[0]) || null :
                                           null;

    // Get all people from lineage for context and calculate life events
    const allPeople = getAllPeople(lineageData);
    const lifeEvents = getLifeEvents(nodeData, allPeople);
    const personalEvents = getPersonalEvents(nodeData);

    return {
      detailItems,
      children,
      parentData,
      lifeEvents,
      personalEvents
    };
  }, [nodeData]);
};
