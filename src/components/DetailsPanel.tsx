import React from 'react';
import DetailList, { DetailItem } from './DetailList';
import { getSimpleValue } from "../utils/isSimpleValue";
import { PersonNodeData } from "./PersonNodeComponent";
import { LineageData, lineageData } from "../domain/LineageData";
import { getAllPeople, getLifeEvents, getPersonalEvents } from "../utils/lifeEvents";

interface DetailsPanelProps {
  nodeData: PersonNodeData | null;
  onNodeSelect?: (node: LineageData) => void;
  isMobile?: boolean;
  personTitle?: string;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({nodeData, onNodeSelect, isMobile = false, personTitle}) => {
  if (!nodeData) {
    return (
      <div style={{
        padding: isMobile ? 16 : 24,
        width: isMobile ? '100%' : '30%',
        background: '#fff',
        borderLeft: isMobile ? 'none' : '1px solid #e2e8f0',
        height: isMobile ? 'auto' : '100vh',
        boxSizing: 'border-box',
        color: '#888',
        fontSize: 16,
        minHeight: isMobile ? '50vh' : 'auto'
      }}>
        {isMobile ? 'Tap a person in the tree to see their details.' : 'Select a person to see details.'}
      </div>
    );
  }
  
  const omittedKeys = ['name', 'selected', 'highlighted', 'generation', 'parent', 'children', 'id'];

  const detailItems: DetailItem[] = Object.entries(nodeData)
    .filter(([key]) => !omittedKeys.includes(key))
    .map(([key, value]) => ({key, value: getSimpleValue(value, '-')}));
  
  const children = nodeData?.children || [];
  const parentData = nodeData?.parent || null;

  // Get all people from lineage for context and calculate life events
  const allPeople = getAllPeople(lineageData);
  const lifeEvents = getLifeEvents(nodeData, allPeople);
  const personalEvents = getPersonalEvents(nodeData);

  const containerPadding = isMobile ? 16 : 24;
  const sectionSpacing = isMobile ? 20 : 24;

  return (
    <div style={{
      padding: containerPadding,
      width: isMobile ? '100%' : '30%',
      background: '#fff',
      borderLeft: isMobile ? 'none' : '1px solid #e2e8f0',
      height: isMobile ? 'auto' : '100vh',
      boxSizing: 'border-box',
      overflow: 'auto'
    }}>
      <div style={{
        fontWeight: 700,
        fontSize: isMobile ? 20 : 22,
        marginBottom: isMobile ? 12 : 16,
        wordWrap: 'break-word'
      }}>{personTitle || nodeData.name}</div>

      <DetailList items={detailItems}/>

      {/* Personal Events Section */}
      {personalEvents.length > 0 && (
        <div style={{marginTop: sectionSpacing}}>
          <div style={{fontWeight: 600, fontSize: isMobile ? 15 : 16, marginBottom: 12, color: '#374151'}}>
            Personal Events & Actions ({personalEvents.length})
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: isMobile ? 10 : 8}}>
            {personalEvents.map((event) => (
              <div
                key={`${event.personId}-${event.eventName}`}
                style={{
                  padding: isMobile ? '12px' : '12px 14px',
                  background: '#fef7f0',
                  border: '1px solid #fb923c',
                  borderRadius: 6,
                  fontSize: isMobile ? 14 : 13,
                  color: '#374151',
                }}
              >
                <div style={{fontWeight: 600, marginBottom: 4, color: '#c2410c', fontSize: isMobile ? 15 : 'inherit'}}>
                  {event.eventName}
                </div>
                <div style={{fontSize: isMobile ? 13 : 12, color: '#6b7280', marginBottom: 6}}>
                  {event.jasherReference}
                </div>
                <div style={{fontSize: isMobile ? 13 : 12, lineHeight: 1.4, marginBottom: 6}}>
                  {event.description}
                </div>
                {event.relatedPersonIds && event.relatedPersonIds.length > 0 && (
                  <div style={{fontSize: isMobile ? 12 : 11, color: '#6b7280', marginTop: 6}}>
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
        <div style={{marginTop: sectionSpacing}}>
          <div style={{fontWeight: 600, fontSize: isMobile ? 15 : 16, marginBottom: 12, color: '#374151'}}>
            Events During Lifetime ({lifeEvents.length})
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: isMobile ? 10 : 8}}>
            {lifeEvents.map((event) => (
              <div
                key={`${event.dateAM}-${event.eventName}`}
                style={{
                  padding: isMobile ? '12px' : '10px 12px',
                  background: '#f0f9ff',
                  border: '1px solid #0ea5e9',
                  borderRadius: 6,
                  fontSize: isMobile ? 14 : 13,
                  color: '#374151',
                }}
              >
                <div style={{fontWeight: 600, marginBottom: 4, color: '#0c4a6e', fontSize: isMobile ? 15 : 'inherit'}}>
                  {event.eventName}
                </div>
                <div style={{fontSize: isMobile ? 13 : 12, color: '#6b7280', marginBottom: 4}}>
                  Year {event.dateAM} AM ({event.dateBCEstimate} BC) • {event.scriptureReference}
                </div>
                <div style={{fontSize: isMobile ? 13 : 12, lineHeight: 1.4}}>
                  {event.description}
                </div>
                {event.keyFigures.length > 0 && (
                  <div style={{fontSize: isMobile ? 12 : 11, color: '#6b7280', marginTop: 6}}>
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
        <div style={{marginTop: sectionSpacing}}>
          <div style={{fontWeight: 600, fontSize: isMobile ? 15 : 16, marginBottom: 12, color: '#374151'}}>
            Parent
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: isMobile ? 10 : 8}}>
            <button
              key={parentData.id}
              onClick={() => onNodeSelect?.(parentData)}
              style={{
                padding: isMobile ? '12px' : '8px 12px',
                background: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: 6,
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: isMobile ? 15 : 14,
                color: '#374151',
                transition: 'all 0.15s',
                fontWeight: 500,
                minHeight: isMobile ? '48px' : 'auto'
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
                <span style={{color: '#6b7280', fontWeight: 400, marginLeft: 8, fontSize: isMobile ? 14 : 'inherit'}}>
                    (born {parentData.birthYear})
                  </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Children Section */}
      {children.length > 0 && (
        <div style={{marginTop: sectionSpacing}}>
          <div style={{fontWeight: 600, fontSize: isMobile ? 15 : 16, marginBottom: 12, color: '#374151'}}>
            Children ({children.length})
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: isMobile ? 10 : 8}}>
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => onNodeSelect?.(child)}
                style={{
                  padding: isMobile ? '12px' : '8px 12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: isMobile ? 15 : 14,
                  color: '#374151',
                  transition: 'all 0.15s',
                  fontWeight: 500,
                  minHeight: isMobile ? '48px' : 'auto'
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
                  <span style={{color: '#6b7280', fontWeight: 400, marginLeft: 8, fontSize: isMobile ? 14 : 'inherit'}}>
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
