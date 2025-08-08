export const getDetailsPanelStyles = (isMobile: boolean) => {
  const containerPadding = isMobile ? 16 : 24;
  const sectionSpacing = isMobile ? 20 : 24;

  return {
    containerPadding,
    sectionSpacing,
    container: {
      padding: containerPadding,
      width: isMobile ? '100%' : '30%',
      background: '#fff',
      borderLeft: isMobile ? 'none' : '1px solid #e2e8f0',
      height: isMobile ? 'auto' : '100vh',
      boxSizing: 'border-box' as const,
      overflow: 'auto' as const
    },
    emptyState: {
      padding: containerPadding,
      width: isMobile ? '100%' : '30%',
      background: '#fff',
      borderLeft: isMobile ? 'none' : '1px solid #e2e8f0',
      height: isMobile ? 'auto' : '100vh',
      boxSizing: 'border-box' as const,
      color: '#888',
      fontSize: 16,
      minHeight: isMobile ? '50vh' : 'auto'
    },
    title: {
      fontWeight: 700,
      fontSize: isMobile ? 20 : 22,
      marginBottom: isMobile ? 12 : 16,
      wordWrap: 'break-word' as const
    }
  };
};
