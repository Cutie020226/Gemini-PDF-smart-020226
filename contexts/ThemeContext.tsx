import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ThemeName, ThemeColors } from '../types';
import { THEMES } from '../constants';

interface ThemeContextType {
  currentTheme: ThemeName;
  colors: ThemeColors;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setTheme] = useState<ThemeName>('Monet');

  const colors = THEMES[currentTheme];

  useEffect(() => {
    // Set CSS variables for global usage (e.g., in Tailwind config extension or raw CSS)
    const root = document.documentElement;
    root.style.setProperty('--color-bg-start', colors.backgroundStart);
    root.style.setProperty('--color-bg-end', colors.backgroundEnd);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-text', colors.text);
  }, [currentTheme, colors]);

  return (
    <ThemeContext.Provider value={{ currentTheme, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};