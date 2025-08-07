import React from 'react';
import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { LineageData } from "../domain/LineageData";

export type AdamNodeData = LineageData & {
  type: 'adamNode'; // Type identifier for this node
  parent?: LineageData | null; // ID of the parent node
  selected?: boolean;
  highlighted?: boolean;
  generation?: number;
  [key: string]: any;
}
export type AdamNode = Node<AdamNodeData, 'adamNode'>;

export default function AdamNodeComponent({ data }: NodeProps<AdamNode>) {
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

  return (
    <div
      style={{
        padding: '8px 12px',
        borderRadius: 6,
        background,
        border,
        boxShadow,
        minWidth: 140,
        fontSize: 13,
        lineHeight: 1.4,
        color: '#222',
        textAlign: 'left',
        maxWidth: 220,
        cursor: 'pointer',
        transition: 'all 0.15s',
        position: 'relative',
        opacity,
      }}
    >
      {/* Handle for incoming connections (from parent) */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#a09ce4',
          width: 8,
          height: 8,
          border: '2px solid #fff',
        }}
      />
      
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{data.name}</div>
      <div style={{ marginBottom: 2 }}><span style={{ color: '#555' }}>Birth year:</span> {data.birthYear ?? '-'}</div>
      <div style={{ marginBottom: 2 }}><span style={{ color: '#555' }}>Age:</span> {data.ageAtDeath ?? '-'}</div>
      <div style={{ marginBottom: 2 }}><span style={{ color: '#555' }}>Children:</span> {data.children?.length ?? 0}</div>
      
      {/* Handle for outgoing connections (to children) */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: '#a09ce4',
          width: 8,
          height: 8,
          border: '2px solid #fff',
        }}
      />
    </div>
  );
}
