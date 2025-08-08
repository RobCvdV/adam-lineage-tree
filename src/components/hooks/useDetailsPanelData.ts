import { useMemo } from 'react';
import { PersonNodeData } from '../PersonNodeComponent';
import { getSimpleValue } from '../../utils/isSimpleValue';
import { DetailItem } from '../DetailList';
import { getAllPeople, getLifeEvents, getPersonalEvents } from '../../utils/lifeEvents';
import { lineageData } from '../../domain/LineageData';

const OMITTED_KEYS = ['name', 'selected', 'highlighted', 'generation', 'parent', 'children', 'id'];

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

    const detailItems: DetailItem[] = Object.entries(nodeData)
      .filter(([key]) => !OMITTED_KEYS.includes(key))
      .map(([key, value]) => ({key, value: getSimpleValue(value, '-')}));

    const children = nodeData?.children || [];
    const parentData = nodeData?.parent || null;

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
