import React from 'react';
import { NodeProps, Node } from '@xyflow/react';

export type AdamNodeData = {
  name: string;
  birthYear?: number | null;
  age?: number | null;
  children?: number;
  selected?: boolean;
  [key: string]: any;
}
export type AdamNode = Node<AdamNodeData, 'adamNode'>;

export default function AdamNode({ data }: NodeProps<AdamNode>) {
  return <div
    style={{
      padding: '8px 12px',
      borderRadius: 6,
      background: data.selected ? '#e0f2fe' : '#f7fafc',
      border: data.selected ? '2px solid #38bdf8' : '1px solid #cbd5e1',
      boxShadow: data.selected ? '0 2px 8px rgba(56,189,248,0.10)' : '0 1px 4px rgba(0,0,0,0.04)',
      minWidth: 140,
      fontSize: 13,
      lineHeight: 1.4,
      color: '#222',
      textAlign: 'left',
      maxWidth: 220,
      cursor: 'pointer',
      transition: 'all 0.15s',
    }}
  >
    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{data.name}</div>
    <div style={{ marginBottom: 2 }}><span style={{ color: '#555' }}>Birth year:</span> {data.birthYear ?? '-'}</div>
    <div style={{ marginBottom: 2 }}><span style={{ color: '#555' }}>Age:</span> {data.age ?? '-'}</div>
    <div style={{ marginBottom: 2 }}><span style={{ color: '#555' }}>Children:</span> {data.children ?? 0}</div>
  </div>
}

