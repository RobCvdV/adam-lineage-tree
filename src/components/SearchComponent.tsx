import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { eventsData, lineageData, LineageData } from '../domain/LineageData';
import { Event } from '../domain/EventsData';
import { CharacterEventData, characterEventsData } from '../domain/CharacterEventsData';

interface SearchResult {
  type: 'person' | 'person-event' | 'event';
  id: string;
  name: string;
  description?: string;
  data: LineageData | Event | CharacterEventData;
}

interface SearchComponentProps {
  isMobile?: boolean;
  onSelectPerson: (person: LineageData, highlightEvent?: {
    type: 'life-event' | 'personal-event',
    eventId: string
  }) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({onSelectPerson, isMobile}) => {
  const {theme} = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Perform search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search people
    lineageData.forEach(person => {
      if (person.name.toLowerCase().includes(term) ||
        person.comment?.toLowerCase().includes(term)) {
        searchResults.push({
          type: 'person',
          id: person.id,
          name: person.name,
          description: person.comment,
          data: person
        });
      }
    });

    // Search events
    eventsData.forEach((event: Event) => {
      if (event.eventName.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term)) {

        searchResults.push({
          type: 'event',
          id: event.eventName,
          name: event.eventName,
          description: event.description.length > 100
                       ? event.description.substring(0, 100) + '...'
                       : event.description,
          data: event
        });
      }
    });

    // Search character events (person events)
    characterEventsData.forEach((charEvent: CharacterEventData) => {
      const person = lineageData.find(p => p.id === charEvent.personId);
      const personName = person?.name || charEvent.personId;

      if (personName.toLowerCase().includes(term) ||
        charEvent.eventName.toLowerCase().includes(term) ||
        charEvent.description.toLowerCase().includes(term)) {

        searchResults.push({
          type: 'person-event',
          id: `${charEvent.personId}-${charEvent.eventName}`,
          name: `${personName} - ${charEvent.eventName}`,
          description: charEvent.description.length > 100
                       ? charEvent.description.substring(0, 100) + '...'
                       : charEvent.description,
          data: charEvent
        });
      }
    });

    // Sort results: people first, then person-events, then general events
    searchResults.sort((a, b) => {
      const typeOrder = {'person': 0, 'person-event': 1, 'event': 2};
      const aOrder = typeOrder[a.type];
      const bOrder = typeOrder[b.type];

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      return a.name.localeCompare(b.name);
    });

    setResults(searchResults); // Show all results since we have full height
  }, [searchTerm]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'person') {
      onSelectPerson(result.data as LineageData);
    } else if (result.type === 'person-event') {
      // For person events, find the person associated with the event
      const charEvent = result.data as CharacterEventData;
      const person = lineageData.find(p => p.id === charEvent.personId);
      if (person) {
        onSelectPerson(person, {
          type: 'personal-event',
          eventId: `${charEvent.personId}-${charEvent.eventName}`
        });
      }
    } else {
      // For general events, find the most relevant person
      const event = result.data as Event;
      if (event.keyFigures.length > 0) {
        // Use the first person from keyFigures list (most relevant)
        const firstKeyFigureId = event.keyFigures.find(kf => lineageData.some(p => p.id === kf));
        const person = lineageData.find(p => p.id === firstKeyFigureId);
        if (person) {
          onSelectPerson(person, {
            type: 'life-event',
            eventId: `${event.dateAM}-${event.eventName}`
          });
        }
      }
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      right: '16px',
      zIndex: 20
    }}>
      {/* Search Button/Input Container */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}>
        {/* Expandable Search Input */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          height: '40px',
          width: isOpen ? (isMobile ? '280px' : '320px') : '40px',
          transition: 'width 0.3s ease-in-out',
          borderRadius: '20px',
          border: `1px solid ${theme.buttonBorder}`,
          background: theme.buttonBackground,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
          {/* Search Input */}
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search people and events..."
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: 'transparent',
              color: theme.primaryText,
              fontSize: '14px',
              outline: 'none',
              paddingLeft: '16px',
              paddingRight: '48px',
              opacity: isOpen ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
              transitionDelay: isOpen ? '0.1s' : '0s'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsOpen(false);
                setSearchTerm('');
              } else if (e.key === 'Enter' && results.length > 0) {
                handleResultClick(results[0]);
              }
            }}
            onBlur={() => {
              // Close if input loses focus and no search term
              if (!searchTerm.trim()) {
                setIsOpen(false);
              }
            }}
          />

          {/* Search Icon Button */}
          <button
            onClick={() => {
              if (!isOpen) {
                setIsOpen(true);
              } else if (!searchTerm.trim()) {
                setIsOpen(false);
              }
            }}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              background: 'transparent',
              color: theme.buttonText,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = theme.buttonHoverText;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.buttonText;
            }}
          >
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="3" fill="none"/>
              <path d="m25 25-7-7" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '48px',
            right: '0px',
            width: isMobile ? '280px' : '320px',
            // maxHeight: 'calc(100vh - 80px)',
            background: theme.panelBackground,
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            border: `1px solid ${theme.sectionBorder}`,
            overflow: 'hidden',
            zIndex: 101
          }}
        >
          <div style={{
            maxHeight: 'calc(100vh - 80px)',
            overflowY: 'auto'
          }}>
            {results.map((result, index) => (
              <div
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: index < results.length - 1 ? `1px solid ${theme.sectionBorder}` : 'none',
                  transition: 'background 0.1s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = theme.buttonHoverBackground;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px'
                }}>
                  <span style={{
                    fontSize: '12px',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    background: result.type === 'person' ? '#3b82f6' : result.type === 'person-event' ? '#f59e0b' : '#10b981',
                    color: 'white',
                    fontWeight: 500
                  }}>
                    {result.type === 'person' ? 'Person' : result.type === 'person-event' ? 'Person-Event' : 'Event'}
                  </span>
                  <span style={{
                    fontWeight: 500,
                    color: theme.primaryText,
                    fontSize: '14px'
                  }}>
                    {result.name}
                  </span>
                </div>
                {result.description && (
                  <div style={{
                    fontSize: '12px',
                    color: theme.secondaryText,
                    lineHeight: '1.4'
                  }}>
                    {result.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {isOpen && results.length === 0 && searchTerm.trim() && (
        <div style={{
          position: 'absolute',
          top: '48px',
          right: '0px',
          width: isMobile ? '280px' : '320px',
          background: theme.panelBackground,
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          border: `1px solid ${theme.sectionBorder}`,
          padding: '16px',
          color: theme.secondaryText,
          textAlign: 'center',
          fontSize: '14px',
          zIndex: 101
        }}>
          No results found
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
