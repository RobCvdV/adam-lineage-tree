import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { LineageData } from '../domain/LineageData';

interface ParentSectionProps {
  parentData: LineageData | null;
  onNodeSelect?: (node: LineageData) => void;
  isMobile: boolean;
  sectionSpacing: number;
}

const ParentSection: React.FC<ParentSectionProps> = ({
  parentData,
  onNodeSelect,
  isMobile,
  sectionSpacing
}) => {
  const {theme} = useTheme();

  if (!parentData) return null;

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = theme.buttonHoverBackground;
    e.currentTarget.style.borderColor = theme.buttonHoverBorder;
    e.currentTarget.style.color = theme.buttonHoverText;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = theme.buttonBackground;
    e.currentTarget.style.borderColor = theme.buttonBorder;
    e.currentTarget.style.color = theme.buttonText;
  };

  return (
    <div style={{marginTop: sectionSpacing}}>
      <div style={{
        fontWeight: 600,
        fontSize: isMobile ? 15 : 16,
        marginBottom: 12,
        color: theme.primaryText
      }}>
        Parent
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: isMobile ? 10 : 8}}>
        <button
          onClick={() => onNodeSelect?.(parentData)}
          style={{
            padding: isMobile ? '12px' : '8px 12px',
            background: theme.buttonBackground,
            border: `1px solid ${theme.buttonBorder}`,
            borderRadius: 6,
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: isMobile ? 15 : 14,
            fontWeight: 500,
            color: theme.buttonText,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {parentData.name}
          {Boolean(parentData.birthYear) && (
            <span style={{
              color: '#6b7280',
              fontWeight: 400,
              marginLeft: 8,
              fontSize: isMobile ? 14 : 'inherit'
            }}>
              (born {parentData.birthYear})
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ParentSection;
