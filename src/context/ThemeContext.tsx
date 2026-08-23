import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'day' | 'night';

interface ThemeContextType {
  theme: ThemeMode;
  isDay: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('lunova_theme_mode');
      if (saved === 'day' || saved === 'night') {
        return saved;
      }
      return 'night';
    } catch {
      return 'night';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('lunova_theme_mode', theme);
    } catch {
      // ignore
    }

    const root = document.documentElement;
    const body = document.body;

    if (theme === 'day') {
      root.setAttribute('data-theme', 'day');
      root.classList.add('theme-day');
      root.classList.remove('theme-night');
      body.classList.add('theme-day');
      body.classList.remove('theme-night');
    } else {
      root.setAttribute('data-theme', 'night');
      root.classList.add('theme-night');
      root.classList.remove('theme-day');
      body.classList.add('theme-night');
      body.classList.remove('theme-day');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'day' ? 'night' : 'day'));
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDay: theme === 'day',
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
