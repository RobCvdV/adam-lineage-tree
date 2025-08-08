import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface ThemeColors {
  // Background colors
  background: string;
  surfaceBackground: string;
  panelBackground: string;

  // Text colors
  primaryText: string;
  secondaryText: string;
  mutedText: string;

  // Node colors
  nodeBackground: string;
  nodeBorder: string;
  nodeSelectedBackground: string;
  nodeSelectedBorder: string;
  nodeText: string;

  // Button colors
  buttonBackground: string;
  buttonBorder: string;
  buttonText: string;
  buttonHoverBackground: string;
  buttonHoverBorder: string;
  buttonHoverText: string;

  // Edge colors
  edgeStroke: string;
  edgeHighlight: string;

  // Section colors
  sectionBorder: string;
}

const lightTheme: ThemeColors = {
  background: '#ffffff',
  surfaceBackground: '#f9fafb',
  panelBackground: '#ffffff',

  primaryText: '#111827',
  secondaryText: '#374151',
  mutedText: '#6b7280',

  nodeBackground: '#ffffff',
  nodeBorder: '#d1d5db',
  nodeSelectedBackground: '#fef3c7',
  nodeSelectedBorder: '#f59e0b',
  nodeText: '#111827',

  buttonBackground: '#fef3c7',
  buttonBorder: '#f59e0b',
  buttonText: '#374151',
  buttonHoverBackground: '#fbbf24',
  buttonHoverBorder: '#d97706',
  buttonHoverText: '#ffffff',

  edgeStroke: '#6b7280',
  edgeHighlight: '#fbbf24',

  sectionBorder: '#e5e7eb'
};

const darkTheme: ThemeColors = {
  background: '#111827',
  surfaceBackground: '#262c32',
  panelBackground: '#374151',

  primaryText: '#f9fafb',
  secondaryText: '#d1d5db',
  mutedText: '#9ca3af',

  nodeBackground: '#374151',
  nodeBorder: '#6b7280',
  nodeSelectedBackground: '#265151',
  nodeSelectedBorder: '#f5c60b',
  nodeText: '#f9fafb',

  buttonBackground: '#265151',
  buttonBorder: '#f5c60b',
  buttonText: '#d1d5db',
  buttonHoverBackground: '#213a3a',
  buttonHoverBorder: '#f5c60b',
  buttonHoverText: '#ffffff',

  edgeStroke: '#9ca3af',
  edgeHighlight: '#fbbf24',

  sectionBorder: '#6b7280'
};

interface ThemeContextType {
  isDarkMode: boolean;
  theme: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Always start with system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    // Add listener for system theme changes
    mediaQuery.addEventListener('change', handleChange);

    // Set initial value based on system preference
    setIsDarkMode(mediaQuery.matches);

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    // Apply theme to document body
    document.body.style.backgroundColor = theme.background;
    document.body.style.color = theme.primaryText;
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  }, [theme]);

  // Remove the toggleTheme function since we're following system preferences
  return (
    <ThemeContext.Provider value={{isDarkMode, theme, toggleTheme: () => {}}}>
      {children}
    </ThemeContext.Provider>
  );
};
