import React from 'react';
import { LineageData } from "../domain/LineageData";
import { useTheme } from '../context/ThemeContext';

interface ParentSectionProps {
  parentsData: LineageData[];
  onNodeSelect?: (node: LineageData) => void;
  isMobile?: boolean;
}

const ParentSection: React.FC<ParentSectionProps> = ({
  parentsData,
  onNodeSelect,
  isMobile = false
}) => {
  const {theme} = useTheme();

  if (!parentsData || parentsData.length === 0) return null;

  const sectionStyle = {
    padding: '16px 0px',
    borderBottom: `1px solid ${theme.sectionBorder}`,
  };

  const titleStyle = {
    fontSize: isMobile ? '16px' : '18px',
    fontWeight: 600,
    color: theme.primaryText,
    marginBottom: '12px',
  };

  const parentButtonStyle = {
    background: theme.buttonBackground,
    border: `1px solid ${theme.buttonBorder}`,
    borderRadius: '6px',
    padding: '8px 12px',
    marginBottom: '8px',
    display: 'block',
    width: '100%',
    textAlign: 'left' as const,
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: theme.buttonText,
    fontSize: '14px',
  };

  const parentButtonHoverStyle = {
    background: theme.buttonHoverBackground,
    color: theme.buttonHoverText,
    borderColor: theme.buttonBorder,
  };

  return (
    <div style={sectionStyle}>
      <div style={titleStyle}>
        {parentsData.length === 1 ? 'Parent' : 'Parents'}
      </div>

      {parentsData.map((parent) => (
        <button
          key={parent.id}
          style={parentButtonStyle}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, parentButtonHoverStyle);
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, parentButtonStyle);
          }}
          onClick={() => onNodeSelect?.(parent)}
        >
          <div style={{fontWeight: 600}}>
            {parent.name}
            {parent.birthYear !== null && parent.birthYear !== undefined && (
              <span style={{
                fontWeight: 400,
                color: theme.mutedText,
                marginLeft: '8px'
              }}>
                (born {parent.birthYear})
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default ParentSection;
