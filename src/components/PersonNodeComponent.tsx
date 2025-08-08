import React, { useEffect, useState } from 'react';
import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { LineageData } from "../domain/LineageData";

export type PersonNodeData = LineageData & {
  // Additional properties specific to PersonNode
  parent?: LineageData | null;
  selected?: boolean;
  highlighted?: boolean;
  generation?: number;
};

export type PersonNode = Node<PersonNodeData, 'personNode'>;

export default function PersonNodeComponent({ data }: NodeProps<PersonNode>) {
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile for responsive styling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Helper function to get highlighting style based on generation
  const getHighlightStyle = (generation: number) => {
    const styles = [
      // Generation 1 (children)
      {
        background: '#fefce8', // bright yellow
        border: '1px solid #fbbf24',
        boxShadow: '0 1px 4px rgba(251,191,36,0.25)',
        opacity: 1.0,
      },
      // Generation 2 (grandchildren)
      {
        background: '#fffbeb', // lighter yellow
        border: '1px solid #f59e0b',
        boxShadow: '0 1px 4px rgba(245,158,11,0.15)',
        opacity: 0.8,
      },
      // Generation 3 (great-grandchildren)
      {
        background: '#fefdf8', // very light yellow
        border: '1px solid #d97706',
        boxShadow: '0 1px 4px rgba(217,119,6,0.10)',
        opacity: 0.6,
      },
    ];
    
    return styles[generation - 1] || styles[2]; // fallback to generation 3 style
  };

  // Determine background and border colors based on state
  let background = '#f7fafc'; // default
  let border = '1px solid #cbd5e1'; // default
  let boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; // default
  let opacity = 1.0;
  
  if (data.selected) {
    background = '#e0f2fe';
    border = '2px solid #38bdf8';
    boxShadow = '0 2px 8px rgba(56,189,248,0.10)';
  } else if (data.highlighted && data.generation) {
    const highlightStyle = getHighlightStyle(data.generation);
    background = highlightStyle.background;
    border = highlightStyle.border;
    boxShadow = highlightStyle.boxShadow;
    opacity = highlightStyle.opacity;
  }

  // Responsive sizing
  const nodeWidth = isMobile ? 180 : 220;
  const nodePadding = isMobile ? 12 : 16;
  const fontSize = isMobile ? 14 : 16;
  const detailFontSize = isMobile ? 11 : 12;

  return (
    <div
      style={{
        background,
        border,
        borderRadius: '8px',
        padding: nodePadding,
        minWidth: nodeWidth,
        maxWidth: nodeWidth,
        boxShadow,
        opacity,
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        // Ensure touch targets are large enough on mobile
        minHeight: isMobile ? '60px' : '50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      {/* Input handle for connections from parents */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#4f46e5',
          width: isMobile ? 10 : 8,
          height: isMobile ? 10 : 8,
          border: '2px solid white'
        }}
      />

      {/* Person's name */}
      <div style={{
        fontWeight: 600,
        fontSize: fontSize,
        color: '#374151',
        marginBottom: 4,
        lineHeight: 1.2,
        textAlign: 'center',
        wordBreak: 'break-word'
      }}>
        {data.name}
      </div>

      {/* Birth year and age */}
      <div style={{
        fontSize: detailFontSize,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 1.2
      }}>
        {data.birthYear !== null && data.birthYear !== undefined && (
          <div>Born: {data.birthYear} AM</div>
        )}
        {data.ageAtDeath !== null && data.ageAtDeath !== undefined && (
          <div>Age: {data.ageAtDeath} years</div>
        )}
      </div>

      {/* Output handle for connections to children */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: '#4f46e5',
          width: isMobile ? 10 : 8,
          height: isMobile ? 10 : 8,
          border: '2px solid white'
        }}
      />
    </div>
  );
}
