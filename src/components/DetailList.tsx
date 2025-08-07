import React from 'react';

export interface DetailItem {
  key: string;
  value: any;
}

export interface DetailListProps {
  items: DetailItem[];
  className?: string;
}

const DetailList: React.FC<DetailListProps> = ({ items, className = '' }) => {
  const renderValue = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (Array.isArray(value)) return `Array (${value.length} items)`;
    if (typeof value === 'object') return '[Object]';
    return String(value);
  };

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map(({ key, value }) => (
        <div
          key={key}
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '12px',
            padding: '4px 0',
            borderBottom: '1px solid #f1f5f9',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              color: '#555',
              fontWeight: 500,
              minWidth: '100px',
              flexShrink: 0,
              wordWrap: 'break-word',
            }}
          >
            {key}:
          </div>
          <div
            style={{
              color: '#222',
              flex: 1,
              wordWrap: 'break-word',
              overflow: 'hidden',
            }}
          >
            {renderValue(value)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailList;
