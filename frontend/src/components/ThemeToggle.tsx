import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`p-3 rounded-full shadow-md transition-colors duration-300
                ${theme === 'dark' ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-white text-blue-600 hover:bg-gray-100'}`}
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? <i className="fas fa-sun text-xl"></i> : <i className="fas fa-moon text-xl"></i>}
        </button>
    );
};

export default ThemeToggle;
