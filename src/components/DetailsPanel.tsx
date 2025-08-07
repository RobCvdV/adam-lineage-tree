import React from 'react';
import DetailList, { DetailItem } from './DetailList';
import { getSimpleValue } from "../utils/isSimpleValue";

interface DetailsPanelProps {
  nodeData: Record<string, any> | null;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({ nodeData }) => {
  if (!nodeData) {
    return (
      <div style={{ padding: 24, width: '30%', background: '#fff', borderLeft: '1px solid #e2e8f0', height: '100vh', boxSizing: 'border-box', color: '#888', fontSize: 16 }}>
        Select a person to see details.
      </div>
    );
  }

  const detailItems: DetailItem[] = Object.entries(nodeData)
    .filter(([key]) => key !== 'name' && key !== 'selected')
    .map(([key, value]) => ({ key, value: getSimpleValue(value, '-') }));

  return (
    <div style={{ padding: 24, width: '30%', background: '#fff', borderLeft: '1px solid #e2e8f0', height: '100vh', boxSizing: 'border-box', overflow: 'auto' }}>
      <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 16, wordWrap: 'break-word' }}>{nodeData.name}</div>
      <DetailList items={detailItems} />
    </div>
  );
};

export default DetailsPanel;
