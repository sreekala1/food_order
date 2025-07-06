// components/ThemeToggle.jsx
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [dark, setDark] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button 
      className="p-2 bg-gray-300 dark:bg-gray-700 rounded" 
      onClick={() => setDark(!dark)}
    >
      {dark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export default ThemeToggle;
