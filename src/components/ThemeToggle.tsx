import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  isMobile?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({isMobile = false}) => {
  const {isDarkMode, theme, toggleTheme} = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: isMobile ? 16 : 20,
        right: isMobile ? 16 : 20,
        zIndex: 1000,
        width: isMobile ? 48 : 52,
        height: isMobile ? 48 : 52,
        borderRadius: '50%',
        border: `2px solid ${theme.buttonBorder}`,
        background: theme.buttonBackground,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isMobile ? 18 : 20,
        transition: 'all 0.3s ease',
        boxShadow: `0 4px 8px rgba(0, 0, 0, ${isDarkMode ? '0.3' : '0.1'})`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = theme.buttonHoverBackground;
        e.currentTarget.style.borderColor = theme.buttonHoverBorder;
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = theme.buttonBackground;
        e.currentTarget.style.borderColor = theme.buttonBorder;
        e.currentTarget.style.transform = 'scale(1)';
      }}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
