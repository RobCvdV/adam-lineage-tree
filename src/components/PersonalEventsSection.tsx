import React from 'react';

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
}

const PersonalEventsSection: React.FC<PersonalEventsSectionProps> = ({ 
  personalEvents, 
  isMobile, 
  sectionSpacing 
}) => {
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
        color: '#374151'
      }}>
        Personal Events & Actions ({personalEvents.length})
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap}}>
        {personalEvents.map((event) => (
          <div
            key={`${event.personId}-${event.eventName}`}
            style={{
              padding,
              background: '#fef7f0',
              border: '1px solid #fb923c',
              borderRadius: 6,
              fontSize: isMobile ? 14 : 13,
              color: '#374151',
            }}
          >
            <div style={{
              fontWeight: 600, 
              marginBottom: 4, 
              color: '#c2410c', 
              fontSize: fontSize.eventName
            }}>
              {event.eventName}
            </div>
            <div style={{
              fontSize: fontSize.reference, 
              color: '#6b7280', 
              marginBottom: 6
            }}>
              {event.jasherReference}
            </div>
            <div style={{
              fontSize: fontSize.description, 
              lineHeight: 1.4, 
              marginBottom: 6
            }}>
              {event.description}
            </div>
            {event.relatedPersonIds && event.relatedPersonIds.length > 0 && (
              <div style={{
                fontSize: fontSize.related, 
                color: '#6b7280', 
                marginTop: 6
              }}>
                Related people: {event.relatedPersonIds.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalEventsSection;
