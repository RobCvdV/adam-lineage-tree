import React from 'react';
import { LineageData } from "../domain/LineageData";
import { useTheme } from '../context/ThemeContext';

interface PartnerSectionProps {
  partnersData: LineageData[];
  onNodeSelect?: (node: LineageData) => void;
  isMobile?: boolean;
  sectionSpacing?: number;
}

const PartnerSection: React.FC<PartnerSectionProps> = ({
  partnersData,
  onNodeSelect,
  isMobile = false,
  sectionSpacing = 16
}) => {
  const {theme} = useTheme();

  if (!partnersData || partnersData.length === 0) return null;

  const sectionStyle = {
    marginTop: sectionSpacing,
  };

  const titleStyle = {
    fontSize: isMobile ? '15px' : '16px',
    fontWeight: 600,
    color: theme.primaryText,
    marginBottom: '12px',
  };

  const partnerButtonStyle = {
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

  const handlePartnerClick = (partner: LineageData) => {
    if (onNodeSelect) {
      onNodeSelect(partner);
    }
  };

  return (
    <div style={sectionStyle}>
      <div style={titleStyle}>
        {partnersData.length === 1 ? 'Partner' : 'Partners'}
      </div>
      {partnersData.map((partner) => (
        <button
          key={partner.id}
          style={partnerButtonStyle}
          onClick={() => handlePartnerClick(partner)}
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
            {partner.name}
            {Boolean(partner.birthYear) && (
              <span style={{
                color: theme.mutedText,
                fontWeight: 400,
                marginLeft: 8,
                fontSize: isMobile ? 14 : 'inherit'
              }}>
                (born {partner.birthYear})
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default PartnerSection;
