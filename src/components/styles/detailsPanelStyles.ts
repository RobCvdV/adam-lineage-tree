import { ThemeColors } from '../../context/ThemeContext';

export const getDetailsPanelStyles = (isMobile: boolean, theme: ThemeColors) => {
  const containerPadding = isMobile ? 16 : 24;
  const sectionSpacing = isMobile ? 20 : 24;

  return {
    containerPadding,
    sectionSpacing,
    container: {
      width: isMobile ? '100%' : '30%',
      maxWidth: isMobile ? 'none' : '400px',
      minWidth: isMobile ? 'auto' : '300px',
      background: theme.panelBackground,
      borderLeft: isMobile ? 'none' : `1px solid ${theme.sectionBorder}`,
      padding: isMobile ? '16px' : '20px',
      overflowY: 'auto' as const,
      height: isMobile ? 'auto' : '100vh',
      color: theme.primaryText,
      transition: 'background-color 0.3s ease, color 0.3s ease'
    },
    title: {
      fontSize: isMobile ? '20px' : '24px',
      fontWeight: 700,
      marginBottom: isMobile ? '16px' : '20px',
      color: theme.primaryText,
      borderBottom: `2px solid ${theme.sectionBorder}`,
      paddingBottom: '8px'
    },
    emptyState: {
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
      textAlign: 'center' as const,
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }
  };
};
