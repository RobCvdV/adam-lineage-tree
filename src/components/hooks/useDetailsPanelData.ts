import { useMemo } from 'react';
import { PersonNodeData } from '../PersonNodeComponent';
import { LineageData, lineageData } from '../../domain/LineageData';
import { findParents } from '../../utils/parentUtils';
import { getLifeEvents } from '../../utils/lifeEvents';
import { getPersonalEvents } from '../../utils/personalEventsUtils';

export function useDetailsPanelData(nodeData: PersonNodeData | null) {
  return useMemo(() => {
    if (!nodeData) {
      return {
        detailItems: [],
        children: [],
        parentsData: [],
        lifeEvents: [],
        personalEvents: []
      };
    }

    // Find all parents of the current person
    const parentsData = findParents(nodeData, lineageData);

    // Find children data
    const children = nodeData.children
      .map(childId => lineageData.find(person => person.id === childId))
      .filter((child): child is LineageData => child !== undefined);

    // Get life events during the person's lifetime (pass both required parameters)
    const lifeEvents = getLifeEvents(nodeData, lineageData);

    // Get personal events specific to this person
    const personalEvents = getPersonalEvents(nodeData);

    // Create detail items for other properties
    const detailItems = Object.entries(nodeData)
      .filter(([key, value]) => {
        // Exclude these properties as they're handled by specific sections
        const excludedKeys = ['id', 'name', 'children', 'parents', 'selected', 'highlighted', 'generation', 'parent', 'parents', 'partners'];
        return !excludedKeys.includes(key) && value !== null && value !== undefined;
      })
      .map(([key, value]) => ({key, value}));

    return {
      detailItems,
      children,
      parentsData,
      lifeEvents,
      personalEvents
    };
  }, [nodeData]);
}
