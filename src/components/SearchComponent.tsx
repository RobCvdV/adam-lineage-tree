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
  const hasResults = results.length > 0;

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

    setResults(searchResults.slice(0, 8)); // Limit results
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

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      right: '16px',
      zIndex: 20
    }}>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: `1px solid ${theme.buttonBorder}`,
          background: theme.buttonBackground,
          color: theme.buttonText,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = theme.buttonHoverBackground;
          e.currentTarget.style.color = theme.buttonHoverText;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = theme.buttonBackground;
          e.currentTarget.style.color = theme.buttonText;
        }}
      >
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="3" fill="none"/>
          <path d="m25 25-7-7" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Search Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 100
          }}
          onClick={handleClickOutside}
        >
          <div
            style={{
              position: 'absolute',
              top: '60px',
              right: '6px',
              width: isMobile ? 'calc(100% - 12px)' : '400px',
              bottom: hasResults ? '6px' : 'auto',
              background: theme.panelBackground,
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              border: `1px solid ${theme.sectionBorder}`,
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div style={{
              padding: '16px',
              borderBottom: `1px solid ${theme.sectionBorder}`
            }}>
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search people and events..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${theme.sectionBorder}`,
                  borderRadius: '4px',
                  background: theme.surfaceBackground,
                  color: theme.primaryText,
                  fontSize: '14px',
                  outline: 'none'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsOpen(false);
                  } else if (e.key === 'Enter' && results.length > 0) {
                    handleResultClick(results[0]);
                  }
                }}
              />
            </div>

            {/* Search Results */}
            <div style={{
              maxHeight: '100%',
              overflowY: 'auto'
            }}>
              {results.length === 0 && searchTerm.trim() && (
                <div style={{
                  padding: '16px',
                  color: theme.secondaryText,
                  textAlign: 'center',
                  fontSize: '14px'
                }}>
                  No results found
                </div>
              )}

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
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
