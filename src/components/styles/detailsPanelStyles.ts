import { ThemeColors } from '../../context/ThemeContext';
import { CSSProperties } from 'react';

export const getDetailsPanelStyles = (isMobile: boolean, theme: ThemeColors) => {
  const containerPadding = isMobile ? 16 : 24;
  const sectionSpacing = isMobile ? 20 : 24;

  const containerStyles: CSSProperties = {
    width: isMobile ? '100%' : '30%',
    maxWidth: isMobile ? 'none' : '400px',
    minWidth: isMobile ? 'auto' : '300px',
    background: theme.panelBackground,
    borderLeft: isMobile ? 'none' : `1px solid ${theme.sectionBorder}`,
    padding: 0,
    overflowY: isMobile ? 'auto' : 'hidden',
    height: isMobile ? 'auto' : '100vh',
    color: theme.primaryText,
    transition: 'background-color 0.3s ease, color 0.3s ease',
    display: 'flex',
    flexDirection: 'column'
  };

  const titleStyles: CSSProperties = {
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: 700,
    marginBottom: 0,
    color: theme.primaryText,
    borderBottom: `2px solid ${theme.sectionBorder}`,
    paddingBottom: '8px',
    padding: isMobile ? '16px 16px 8px 16px' : '20px 20px 8px 20px',
    background: theme.panelBackground,
    position: isMobile ? 'static' : 'sticky',
    top: 0,
    zIndex: 10,
    flexShrink: 0
  };

  const contentStyles: CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: isMobile ? '16px' : '20px',
    paddingTop: isMobile ? '16px' : '20px'
  };

  const emptyStateStyles: CSSProperties = {
    width: isMobile ? '100%' : '30%',
    maxWidth: isMobile ? 'none' : '400px',
    minWidth: isMobile ? 'auto' : '300px',
    background: theme.panelBackground,
    borderLeft: isMobile ? 'none' : `1px solid ${theme.sectionBorder}`,
    padding: isMobile ? '16px' : '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: isMobile ? '200px' : '100vh',
    color: theme.mutedText,
    fontSize: '16px',
    textAlign: 'center',
    transition: 'background-color 0.3s ease, color 0.3s ease'
  };

  return {
    containerPadding,
    sectionSpacing,
    container: containerStyles,
    title: titleStyles,
    content: contentStyles,
    emptyState: emptyStateStyles
  };
};
