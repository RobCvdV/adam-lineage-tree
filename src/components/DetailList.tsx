import React from 'react';
import { useTheme } from '../context/ThemeContext';

export interface DetailItem {
  key: string;
  value: any;
}

export interface DetailListProps {
  items: DetailItem[];
  className?: string;
}

const DetailList: React.FC<DetailListProps> = ({items, className = ''}) => {
  const {theme} = useTheme();

  const renderValue = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (Array.isArray(value)) return `Array (${value.length} items)`;
    if (typeof value === 'object') return '[Object]';
    return String(value);
  };

  return (
    <div className={className} style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
      {items.map(({key, value}) => (
        <div
          key={key}
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '12px',
            padding: '4px 0',
            borderBottom: `1px solid ${theme.sectionBorder}`,
            alignItems: 'flex-start',
          }}
        >
          <div style={{
            fontWeight: 600,
            minWidth: '80px',
            color: theme.secondaryText,
            fontSize: '14px'
          }}>
            {key}:
          </div>
          <div style={{
            flex: 1,
            color: theme.primaryText,
            fontSize: '14px'
          }}>
            {renderValue(value)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailList;
