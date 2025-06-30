import React from 'react';
// import { useTheme } from '../contexts/ThemeContext';
// import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import FloatingIcons from './FloatingIcons';

const Header: React.FC = () => {
    // const { theme } = useTheme();

    return (
        <header
            // className={`relative py-16 overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-100'} text-center rounded-b-lg shadow-lg`}
            className={`relative py-16 overflow-hidden bg-blue-100 text-center rounded-b-lg shadow-lg`}
        >
            {}
            <FloatingIcons />

            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <h1 className="text-6xl md:text-8xl font-black text-primary drop-shadow-lg leading-none mb-2">
                    Morgan
                </h1>
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-700 dark:text-gray-300">Jaouen</h2>
            </div>

            {}
            <div className="absolute top-4 right-4 flex space-x-2 z-20">
                {/* <ThemeToggle /> */}
                <LanguageSwitcher />
            </div>
        </header>
    );
};

export default Header;
