import React from 'react';
import DetailList, { DetailItem } from './DetailList';
import { getSimpleValue } from "../utils/isSimpleValue";
import { LineageData } from '../domain/LineageData';

interface DetailsPanelProps {
  nodeData: LineageData | null;
  parentData?: LineageData | null;
  onNodeSelect?: (node: LineageData) => void;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({nodeData, onNodeSelect, parentData}) => {
  if (!nodeData) {
    return (
      <div style={{
        padding: 24,
        width: '30%',
        background: '#fff',
        borderLeft: '1px solid #e2e8f0',
        height: '100vh',
        boxSizing: 'border-box',
        color: '#888',
        fontSize: 16
      }}>
        Select a person to see details.
      </div>
    );
  }

  const detailItems: DetailItem[] = Object.entries(nodeData)
    .filter(([key]) => key !== 'name' && key !== 'selected' && key !== 'highlighted' && key !== 'generation')
    .map(([key, value]) => ({key, value: getSimpleValue(value, '-')}));
  
  const children = nodeData?.children || [];

  return (
    <div style={{
      padding: 24,
      width: '30%',
      background: '#fff',
      borderLeft: '1px solid #e2e8f0',
      height: '100vh',
      boxSizing: 'border-box',
      overflow: 'auto'
    }}>
      <div style={{
        fontWeight: 700,
        fontSize: 22,
        marginBottom: 16,
        wordWrap: 'break-word'
      }}>{nodeData.name}</div>

      <DetailList items={detailItems}/>

      {parentData && (
        <div style={{marginTop: 24}}>
          <div style={{fontWeight: 600, fontSize: 16, marginBottom: 12, color: '#374151'}}>
            Parent
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
            <button
              key={parentData.id}
              onClick={() => onNodeSelect?.(parentData)}
              style={{
                padding: '8px 12px',
                background: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: 6,
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: 14,
                color: '#374151',
                transition: 'all 0.15s',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fbbf24';
                e.currentTarget.style.borderColor = '#d97706';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fef3c7';
                e.currentTarget.style.borderColor = '#f59e0b';
                e.currentTarget.style.color = '#374151';
              }}
            >
              {parentData.name}
              {parentData.birthYear && (
                <span style={{color: '#6b7280', fontWeight: 400, marginLeft: 8}}>
                    (born {parentData.birthYear})
                  </span>
              )}
            </button>
          </div>
        </div>
      )}

      {children.length > 0 && (
        <div style={{marginTop: 24}}>
          <div style={{fontWeight: 600, fontSize: 16, marginBottom: 12, color: '#374151'}}>
            Children ({children.length})
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => onNodeSelect?.(child)}
                style={{
                  padding: '8px 12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 14,
                  color: '#374151',
                  transition: 'all 0.15s',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e0f2fe';
                  e.currentTarget.style.borderColor = '#38bdf8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                {child.name}
                {child.birthYear && (
                  <span style={{color: '#6b7280', fontWeight: 400, marginLeft: 8}}>
                    (born {child.birthYear})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsPanel;
