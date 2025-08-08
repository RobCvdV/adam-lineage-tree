import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { LineageData } from '../domain/LineageData';

interface ClickablePersonNameProps {
  personId: string;
  onNodeSelect?: (node: LineageData) => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const ClickablePersonName: React.FC<ClickablePersonNameProps> = ({
  personId,
  onNodeSelect,
  style = {},
  children
}) => {
  const {theme} = useTheme();

  const handleClick = () => {
    if (onNodeSelect) {
      onNodeSelect({id: personId} as LineageData);
    }
  };

  const defaultStyle: React.CSSProperties = {
    color: theme.primaryText,
    cursor: onNodeSelect ? 'pointer' : 'default',
    textDecoration: onNodeSelect ? 'underline' : 'none',
    transition: 'color 0.2s ease',
    ...style
  };

  if (!onNodeSelect) {
    return <span style={defaultStyle}>{children || personId}</span>;
  }

  return (
    <span
      onClick={handleClick}
      style={defaultStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = theme.secondaryText;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = style.color || theme.primaryText;
      }}
    >
      {children || personId}
    </span>
  );
};

export default ClickablePersonName;
