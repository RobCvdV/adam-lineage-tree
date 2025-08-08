import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Event } from "../domain/EventsData";
import { LineageData } from '../domain/LineageData';
import ClickablePersonName from './ClickablePersonName';

interface LifeEventsSectionProps {
  lifeEvents: Event[];
  isMobile: boolean;
  sectionSpacing: number;
  onNodeSelect?: (node: LineageData) => void;
}

const LifeEventsSection: React.FC<LifeEventsSectionProps> = ({
  lifeEvents,
  isMobile,
  sectionSpacing,
  onNodeSelect
}) => {
  const {theme} = useTheme();

  if (lifeEvents.length === 0) return null;

  const fontSize = {
    title: isMobile ? 18 : 16,
    eventName: isMobile ? 15 : 14,
    date: isMobile ? 13 : 12,
    description: isMobile ? 13 : 12,
    keyFigures: isMobile ? 12 : 11
  };

  const padding = isMobile ? '12px' : '10px 12px';
  const gap = isMobile ? 10 : 8;

  return (
    <div style={{marginTop: sectionSpacing}}>
      <div style={{
        fontWeight: 600,
        fontSize: fontSize.title,
        marginBottom: 12,
        color: theme.primaryText
      }}>
        Events During Lifetime ({lifeEvents.length})
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap}}>
        {lifeEvents.map((event) => (
          <div
            key={`${event.dateAM}-${event.eventName}`}
            style={{
              padding,
              background: theme.surfaceBackground,
              border: `1px solid ${theme.sectionBorder}`,
              borderRadius: 6,
              fontSize: isMobile ? 14 : 13,
              color: theme.primaryText,
              transition: 'background-color 0.3s ease, border-color 0.3s ease',
            }}
          >
            <div style={{
              fontWeight: 600,
              marginBottom: 4,
              color: theme.secondaryText,
              fontSize: fontSize.eventName
            }}>
              {event.eventName}
            </div>
            <div style={{
              fontSize: fontSize.date,
              color: theme.mutedText,
              marginBottom: 4
            }}>
              Year {event.dateAM} AM ({event.dateBCEstimate} BC) • {event.scriptureReference}
            </div>
            <div style={{
              fontSize: fontSize.description,
              lineHeight: 1.4,
              color: theme.primaryText
            }}>
              {event.description}
            </div>
            {event.keyFigures.length > 0 && (
              <div style={{
                fontSize: fontSize.keyFigures,
                color: theme.mutedText,
                marginTop: 6
              }}>
                Key figures: {event.keyFigures.map((personId, index) => (
                <span key={personId}>
                    {index > 0 && ', '}
                  <ClickablePersonName
                    personId={personId}
                    onNodeSelect={onNodeSelect}
                  />
                  </span>
              ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LifeEventsSection;
