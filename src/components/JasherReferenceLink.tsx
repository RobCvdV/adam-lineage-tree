import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface JasherReferenceLinkProps {
  reference: string;
}

const JasherReferenceLink: React.FC<JasherReferenceLinkProps> = ({reference}) => {
  const {theme} = useTheme();

  // Function to create Jasher reference URL
  const createJasherUrl = (reference: string): string | null => {
    const regex = /Jasher (\d+)/;
    const match = regex.exec(reference);
    if (match) {
      const chapter = match[1];
      return `https://sacred-texts.com/chr/apo/jasher/${chapter}.htm`;
    }
    return null;
  };

  const url = createJasherUrl(reference);

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseOver={(e) => {
          e.currentTarget.style.color = theme.primaryText;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = theme.linkText;
        }}
        style={{
          color: theme.linkText,
          textDecoration: 'underline',
          cursor: 'pointer'
        }}
      >
        {reference}
      </a>
    );
  } else {
    return <>{reference}</>;
  }
};

export default JasherReferenceLink;
