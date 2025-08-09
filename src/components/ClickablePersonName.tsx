import React, { useCallback, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getPersonData, LineageData } from '../domain/LineageData';

interface ClickablePersonNameProps {
  personId: string;
  onNodeSelect?: (node: LineageData) => void;
  style?: React.CSSProperties;
}

const ClickablePersonName: React.FC<ClickablePersonNameProps> = ({
  personId,
  onNodeSelect,
  style = {},
}) => {
  const {theme} = useTheme();

  const person = useMemo<LineageData | undefined>(() => getPersonData(personId), [personId]);
  const defaultStyle: React.CSSProperties = {
    color: theme.linkText,
    cursor: person ? 'pointer' : 'default',
    textDecoration: person ? 'underline' : 'none',
    transition: 'color 0.2s ease',
    ...style
  };

  const handleClick = useCallback(() => {
    if (onNodeSelect) {
      onNodeSelect({id: personId} as LineageData);
    }
  }, [onNodeSelect, personId]);

  if (!onNodeSelect || !person) {
    return <span style={defaultStyle}>{person?.name ?? personId}</span>;
  }

  return (
    <span
      onClick={handleClick}
      style={defaultStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = theme.primaryText;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = style.color || theme.linkText;
      }}
    >
      {person.name}
    </span>
  );
};

export default ClickablePersonName;
