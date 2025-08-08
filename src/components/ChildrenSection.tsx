import React from 'react';
import { LineageData } from '../domain/LineageData';

interface ChildrenSectionProps {
  childrenData: LineageData[];
  onNodeSelect?: (node: LineageData) => void;
  isMobile: boolean;
  sectionSpacing: number;
}

const ChildrenSection: React.FC<ChildrenSectionProps> = ({ 
  childrenData, 
  onNodeSelect, 
  isMobile, 
  sectionSpacing 
}) => {
  if (childrenData.length === 0) return null;

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = '#e0f2fe';
    e.currentTarget.style.borderColor = '#38bdf8';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = '#f8fafc';
    e.currentTarget.style.borderColor = '#e2e8f0';
  };

  return (
    <div style={{marginTop: sectionSpacing}}>
      <div style={{
        fontWeight: 600, 
        fontSize: isMobile ? 15 : 16, 
        marginBottom: 12, 
        color: '#374151'
      }}>
        Children ({childrenData.length})
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: isMobile ? 10 : 8}}>
        {childrenData.map((child) => (
          <button
            key={child.id}
            onClick={() => onNodeSelect?.(child)}
            style={{
              padding: isMobile ? '12px' : '8px 12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
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
            {child.name}
            {child.birthYear && (
              <span style={{
                color: '#6b7280', 
                fontWeight: 400, 
                marginLeft: 8, 
                fontSize: isMobile ? 14 : 'inherit'
              }}>
                (born {child.birthYear})
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChildrenSection;
