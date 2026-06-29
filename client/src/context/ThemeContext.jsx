import { createContext, useContext, useState, useEffect } from 'react';
import { theme } from '../styles/theme';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });

  useEffect(() => {
    const mode = isDark ? 'dark' : 'light';
    const colors = theme[mode];
    localStorage.setItem('theme', mode);
    document.documentElement.setAttribute('data-theme', mode);
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
  }, [isDark]);

  const colors = isDark ? theme.dark : theme.light;
  const toggle = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggle, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
