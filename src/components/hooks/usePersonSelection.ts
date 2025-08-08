import { useCallback } from 'react';
import { LineageData } from '../../domain/LineageData';

interface UsePersonSelectionProps {
  onNodeSelect?: (node: LineageData) => void;
}

export const usePersonSelection = ({onNodeSelect}: UsePersonSelectionProps) => {
  const handlePersonClick = useCallback((personId: string) => {
    if (onNodeSelect) {
      onNodeSelect({id: personId} as LineageData);
    }
  }, [onNodeSelect]);

  return {handlePersonClick};
};
