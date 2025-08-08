import React, { useEffect, useState } from 'react';
import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { useTheme } from '../context/ThemeContext';
import { LineageData } from "../domain/LineageData";
import { getNodeSizes, MOBILE_BREAKPOINT } from '../constants/nodeSizes';
import { getGenerationColor } from '../utils/colorUtils';

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
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Helper function to get highlighting style based on generation using color gradation
  const getHighlightStyle = (generation: number) => {
    // Interpolate colors based on generation (0 = full highlight, 3 = default)
    const factor = Math.min(generation / 3, 1);

    const gradientBg = getGenerationColor(theme.nodeSelectedBackground, theme.nodeBackground, factor);
    const gradientBorder = getGenerationColor(theme.nodeSelectedBorder, theme.nodeBorder, factor);

    // Shadow intensity also reduces with generation
    const shadowOpacities = [0.25, 0.15, 0.10];
    const shadowOpacity = shadowOpacities[generation - 1] || 0.10;

    return {
      background: gradientBg,
      border: `1px solid ${gradientBorder}`,
      boxShadow: `0 1px 4px rgba(251,191,36,${shadowOpacity})`,
    };
  };

  // Determine background and border colors based on state
  let background = theme.nodeBackground;
  let border = `1px solid ${theme.nodeBorder}`;
  let boxShadow = '0 1px 4px rgba(0,0,0,0.04)';

  if (data.selected) {
    background = theme.nodeSelectedBackground;
    border = `2px solid ${theme.nodeSelectedBorder}`;
    boxShadow = '0 2px 8px rgba(56,189,248,0.10)';
  } else if (data.highlighted && data.generation) {
    const highlightStyle = getHighlightStyle(data.generation);
    background = highlightStyle.background;
    border = highlightStyle.border;
    boxShadow = highlightStyle.boxShadow;
  }

  // Responsive sizing using constants
  const sizes = getNodeSizes(isMobile);

  return (
    <div
      style={{
        background,
        border,
        borderRadius: '8px',
        padding: sizes.padding,
        minWidth: sizes.width,
        maxWidth: sizes.width,
        boxShadow,
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        // Ensure touch targets are large enough on mobile
        minHeight: sizes.height,
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
          width: sizes.handleSize,
          height: sizes.handleSize,
          border: `2px solid ${theme.nodeBackground}`
        }}
      />

      {/* Person's name */}
      <div style={{
        fontWeight: 600,
        fontSize: sizes.fontSize,
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
        fontSize: sizes.detailFontSize,
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
          width: sizes.handleSize,
          height: sizes.handleSize,
          border: `2px solid ${theme.nodeBackground}`
        }}
      />
    </div>
  );
}
