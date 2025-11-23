import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../../context/DarkModeContext';

const DarkModeToggle = ({ className = '', size = 'md' }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const buttonClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`${buttonClasses[size]} text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ${className}`}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <Sun className={sizeClasses[size]} />
      ) : (
        <Moon className={sizeClasses[size]} />
      )}
    </button>
  );
};

export default DarkModeToggle;
