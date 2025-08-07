import React from 'react';
import DetailList, { DetailItem } from './DetailList';
import { getSimpleValue } from "../utils/isSimpleValue";
import { AdamNodeData } from "./AdamNodeComponent";
import { LineageData, lineageData } from "../domain/LineageData";
import { getAllPeople, getLifeEvents, getPersonalEvents } from "../utils/lifeEvents";

interface DetailsPanelProps {
  nodeData: AdamNodeData | null;
  onNodeSelect?: (node: LineageData) => void;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({nodeData, onNodeSelect}) => {
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
  const parentData = nodeData?.parent || null;

  // Get all people from lineage for context and calculate life events
  const allPeople = getAllPeople(lineageData);
  const lifeEvents = getLifeEvents(nodeData, allPeople);
  const personalEvents = getPersonalEvents(nodeData);

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

      {/* Personal Events Section */}
      {personalEvents.length > 0 && (
        <div style={{marginTop: 24}}>
          <div style={{fontWeight: 600, fontSize: 16, marginBottom: 12, color: '#374151'}}>
            Personal Events & Actions ({personalEvents.length})
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
            {personalEvents.map((event, index) => (
              <div
                key={index}
                style={{
                  padding: '12px 14px',
                  background: '#fef7f0',
                  border: '1px solid #fb923c',
                  borderRadius: 6,
                  fontSize: 13,
                  color: '#374151',
                }}
              >
                <div style={{fontWeight: 600, marginBottom: 4, color: '#c2410c'}}>
                  {event.eventName}
                </div>
                <div style={{fontSize: 12, color: '#6b7280', marginBottom: 6}}>
                  {event.jasherReference}
                </div>
                <div style={{fontSize: 12, lineHeight: 1.4, marginBottom: 6}}>
                  {event.description}
                </div>
                {event.relatedPersonIds && event.relatedPersonIds.length > 0 && (
                  <div style={{fontSize: 11, color: '#6b7280', marginTop: 6}}>
                    Related people: {event.relatedPersonIds.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Life Events Section */}
      {lifeEvents.length > 0 && (
        <div style={{marginTop: 24}}>
          <div style={{fontWeight: 600, fontSize: 16, marginBottom: 12, color: '#374151'}}>
            Events During Lifetime ({lifeEvents.length})
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
            {lifeEvents.map((event, index) => (
              <div
                key={index}
                style={{
                  padding: '10px 12px',
                  background: '#f0f9ff',
                  border: '1px solid #0ea5e9',
                  borderRadius: 6,
                  fontSize: 13,
                  color: '#374151',
                }}
              >
                <div style={{fontWeight: 600, marginBottom: 4, color: '#0c4a6e'}}>
                  {event.eventName}
                </div>
                <div style={{fontSize: 12, color: '#6b7280', marginBottom: 4}}>
                  Year {event.dateAM} AM ({event.dateBCEstimate} BC) • {event.scriptureReference}
                </div>
                <div style={{fontSize: 12, lineHeight: 1.4}}>
                  {event.description}
                </div>
                {event.keyFigures.length > 0 && (
                  <div style={{fontSize: 11, color: '#6b7280', marginTop: 6}}>
                    Key figures: {event.keyFigures.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parent Section */}
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

      {/* Children Section */}
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
