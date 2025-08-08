// Node size constants used throughout the application
export const NODE_SIZES = {
  // Desktop sizes
  desktop: {
    width: 150,
    height: 100,
    padding: 16,
    fontSize: 18,
    detailFontSize: 14,
    handleSize: 8,
    spacing: {
      horizontal: 180, // horizontal spacing between nodes
      vertical: 120,   // vertical spacing between node rows
    }
  },
  // Mobile sizes
  mobile: {
    width: 120,
    height: 90,
    padding: 12,
    fontSize: 15,
    detailFontSize: 12,
    handleSize: 10,
    spacing: {
      horizontal: 140, // horizontal spacing between nodes
      vertical: 110,   // vertical spacing between node rows
    }
  }
};

// Utility function to get sizes based on mobile state
export const getNodeSizes = (isMobile: boolean) => {
  return isMobile ? NODE_SIZES.mobile : NODE_SIZES.desktop;
};

// Breakpoint for mobile detection
export const MOBILE_BREAKPOINT = 768;
