import React, { useEffect, useState } from 'react';
import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { useTheme } from '../context/ThemeContext';
import { LineageData } from "../domain/LineageData";

export type PersonNodeData = LineageData & {
  // Additional properties specific to PersonNode
  parent?: LineageData | null;
  selected?: boolean;
  highlighted?: boolean;
  generation?: number;
};

export type PersonNode = Node<PersonNodeData, 'personNode'>;

export default function PersonNodeComponent({data}: NodeProps<PersonNode>) {
  const [isMobile, setIsMobile] = useState(false);
  const {theme} = useTheme();

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
        background: theme.nodeSelectedBackground,
        border: `1px solid ${theme.nodeSelectedBorder}`,
        boxShadow: '0 1px 4px rgba(251,191,36,0.25)',
        opacity: 1.0,
      },
      // Generation 2 (grandchildren)
      {
        background: theme.nodeSelectedBackground,
        border: `1px solid ${theme.nodeSelectedBorder}`,
        boxShadow: '0 1px 4px rgba(245,158,11,0.15)',
        opacity: 0.8,
      },
      // Generation 3 (great-grandchildren)
      {
        background: theme.nodeSelectedBackground,
        border: `1px solid ${theme.nodeSelectedBorder}`,
        boxShadow: '0 1px 4px rgba(217,119,6,0.10)',
        opacity: 0.6,
      },
    ];

    return styles[generation - 1] || styles[2]; // fallback to generation 3 style
  };

  // Determine background and border colors based on state
  let background = theme.nodeBackground;
  let border = `1px solid ${theme.nodeBorder}`;
  let boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
  let opacity = 1.0;

  if (data.selected) {
    background = theme.nodeSelectedBackground;
    border = `2px solid ${theme.nodeSelectedBorder}`;
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
          background: theme.edgeHighlight,
          width: isMobile ? 10 : 8,
          height: isMobile ? 10 : 8,
          border: `2px solid ${theme.nodeBackground}`
        }}
      />

      {/* Person's name */}
      <div style={{
        fontWeight: 600,
        fontSize: fontSize,
        color: theme.nodeText,
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
        color: theme.mutedText,
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
          background: theme.edgeHighlight,
          width: isMobile ? 10 : 8,
          height: isMobile ? 10 : 8,
          border: `2px solid ${theme.nodeBackground}`
        }}
      />
    </div>
  );
}
