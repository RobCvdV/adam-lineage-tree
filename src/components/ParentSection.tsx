import React from 'react';
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
  if (!parentData) return null;

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = '#fbbf24';
    e.currentTarget.style.borderColor = '#d97706';
    e.currentTarget.style.color = '#fff';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = '#fef3c7';
    e.currentTarget.style.borderColor = '#f59e0b';
    e.currentTarget.style.color = '#374151';
  };

  return (
    <div style={{marginTop: sectionSpacing}}>
      <div style={{
        fontWeight: 600, 
        fontSize: isMobile ? 15 : 16, 
        marginBottom: 12, 
        color: '#374151'
      }}>
        Parent
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: isMobile ? 10 : 8}}>
        <button
          onClick={() => onNodeSelect?.(parentData)}
          style={{
            padding: isMobile ? '12px' : '8px 12px',
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: 6,
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: isMobile ? 15 : 14,
            color: '#374151',
            transition: 'all 0.15s',
            fontWeight: 500,
            minHeight: isMobile ? '48px' : 'auto'
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {parentData.name}
          {parentData.birthYear && (
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
