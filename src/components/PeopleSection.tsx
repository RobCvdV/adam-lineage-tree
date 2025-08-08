import React from 'react';
import { LineageData } from "../domain/LineageData";
import { useTheme } from '../context/ThemeContext';

interface PersonSectionProps {
  peopleData: LineageData[];
  onNodeSelect?: (node: LineageData) => void;
  isMobile?: boolean;
  sectionSpacing?: number;
  titleSingle?: string;
  titlePlural?: string;
}

const PeopleSection: React.FC<PersonSectionProps> = ({
  peopleData,
  onNodeSelect,
  isMobile = false,
  titleSingle = 'Person',
  titlePlural = 'People',
  sectionSpacing = 16
}) => {
  const {theme} = useTheme();

  if (!peopleData || peopleData.length === 0) return null;

  const sectionStyle = {
    marginTop: sectionSpacing,
  };

  const titleStyle = {
    fontSize: isMobile ? '15px' : '16px',
    fontWeight: 600,
    color: theme.primaryText,
    marginBottom: '12px',
  };

  const personButtonStyle = {
    background: theme.buttonBackground,
    border: `1px solid ${theme.buttonBorder}`,
    borderRadius: '6px',
    padding: '8px 12px',
    marginBottom: '8px',
    display: 'block',
    width: '100%',
    textAlign: 'left' as const,
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: theme.buttonText,
    fontSize: '14px',
  };

  const handlePersonClick = (person: LineageData) => {
    if (onNodeSelect) {
      onNodeSelect(person);
    }
  };

  return (
    <div style={sectionStyle}>
      <div style={titleStyle}>
        {peopleData.length === 1 ? titleSingle : titlePlural}{peopleData.length > 2 ? ` (${peopleData.length})` : ''}
      </div>
      {peopleData.map((person) => (
        <button
          key={person.id}
          style={personButtonStyle}
          onClick={() => handlePersonClick(person)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = theme.buttonHoverBackground;
            e.currentTarget.style.color = theme.buttonHoverText;
            e.currentTarget.style.borderColor = theme.buttonBorder;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = theme.buttonBackground;
            e.currentTarget.style.color = theme.buttonText;
            e.currentTarget.style.borderColor = theme.buttonBorder;
          }}
        >
          <div style={{fontWeight: 600}}>
            {person.name}
            {Boolean(person.birthYear) && (
              <span style={{
                color: theme.mutedText,
                fontWeight: 400,
                marginLeft: 8,
                fontSize: isMobile ? 14 : 'inherit'
              }}>
                (born {person.birthYear})
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default PeopleSection;
