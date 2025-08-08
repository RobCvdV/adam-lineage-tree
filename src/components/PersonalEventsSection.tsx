import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { LineageData } from '../domain/LineageData';
import ClickablePersonName from './ClickablePersonName';
import { usePersonSelection } from './hooks/usePersonSelection';

interface PersonalEvent {
  personId: string;
  eventName: string;
  jasherReference: string;
  description: string;
  relatedPersonIds?: string[];
}

interface PersonalEventsSectionProps {
  personalEvents: PersonalEvent[];
  isMobile: boolean;
  sectionSpacing: number;
  onNodeSelect?: (node: LineageData) => void;
}

const PersonalEventsSection: React.FC<PersonalEventsSectionProps> = ({
  personalEvents,
  isMobile,
  sectionSpacing,
  onNodeSelect
}) => {
  const {theme} = useTheme();
  const {handlePersonClick} = usePersonSelection({onNodeSelect});

  if (personalEvents.length === 0) return null;

  const fontSize = {
    title: isMobile ? 15 : 16,
    eventName: isMobile ? 15 : 'inherit',
    reference: isMobile ? 13 : 12,
    description: isMobile ? 13 : 12,
    related: isMobile ? 12 : 11
  };

  const padding = isMobile ? '12px' : '12px 14px';
  const gap = isMobile ? 10 : 8;

  return (
    <div style={{marginTop: sectionSpacing}}>
      <div style={{
        fontWeight: 600,
        fontSize: fontSize.title,
        marginBottom: 12,
        color: theme.primaryText
      }}>
        Personal Events & Actions ({personalEvents.length})
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap}}>
        {personalEvents.map((event) => (
          <div
            key={`${event.personId}-${event.eventName}`}
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
              fontSize: fontSize.reference,
              color: theme.mutedText,
              marginBottom: 4
            }}>
              Reference: {event.jasherReference}
            </div>
            <div style={{
              fontSize: fontSize.description,
              lineHeight: 1.4,
              color: theme.primaryText
            }}>
              {event.description}
            </div>
            {event.relatedPersonIds && event.relatedPersonIds.length > 0 && (
              <div style={{
                fontSize: fontSize.related,
                color: theme.mutedText,
                marginTop: 6
              }}>
                Related: {event.relatedPersonIds.map((personId, index) => (
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

export default PersonalEventsSection;
