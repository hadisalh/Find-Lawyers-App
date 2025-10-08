import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '../ui/icons';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
        return 'light';
    }
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Fallback to user's OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-slate-900 transition-colors"
      aria-label="Toggle theme"
    >
      <SunIcon className={`w-6 h-6 transition-transform duration-300 ${theme === 'light' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} />
      <MoonIcon className={`w-6 h-6 absolute transition-transform duration-300 ${theme === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
    </button>
  );
};