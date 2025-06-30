import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
// import { useTheme } from '../contexts/ThemeContext';

const LanguageSwitcher: React.FC = () => {
    const { language, changeLanguage } = useLanguage();
    // const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'en', name: 'English', flag: '🇬🇧' }
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLanguageChange = (langCode: 'fr' | 'en') => {
        changeLanguage(langCode);
        setIsOpen(false);
    };

    const currentLanguage = languages.find((lang) => lang.code === language);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            {}
            <button
                onClick={() => setIsOpen(!isOpen)}
                // className={`flex items-center justify-between px-4 py-2 rounded-md shadow-md cursor-pointer
                // transition-colors duration-300 w-full min-w-[120px] md:min-w-[150px]  mt-1
                // ${theme === 'dark' ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100'}
                // focus:outline-none focus:ring-2 focus:ring-primary`}
                className={`flex items-center justify-between px-4 py-2 rounded-md shadow-md cursor-pointer
        transition-colors duration-300 w-full min-w-[120px] md:min-w-[150px]  mt-1
        bg-white text-gray-800 hover:bg-gray-100
        focus:outline-none focus:ring-2 focus:ring-primary`}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                {}
                <span className="text-xl mr-2">{currentLanguage?.flag}</span>
                <span className="text-lg font-medium">{currentLanguage?.name}</span>
                {}
                <i
                    className={`fas fa-chevron-down ml-2 text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                ></i>
            </button>

            {}
            {isOpen && (
                <ul
                    role="listbox"
                    // className={`absolute top-full mt-2 w-full rounded-md shadow-lg overflow-hidden z-40
                    // ${theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-300'}
                    // transition-all duration-300 ease-out transform origin-top
                    // ${isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}
                    className={`absolute top-full mt-2 w-full rounded-md shadow-lg overflow-hidden z-40
          bg-white border border-gray-300
          transition-all duration-300 ease-out transform origin-top
          ${isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}
                >
                    {languages.map((lang) => (
                        <li
                            key={lang.code}
                            role="option"
                            aria-selected={lang.code === language}
                            onClick={() => handleLanguageChange(lang.code as 'fr' | 'en')}
                            className={`flex items-center px-4 py-2 cursor-pointer transition-colors duration-200
                ${
                    lang.code === language
                        ? 'bg-primary text-white font-semibold'
                        : /*`${theme === 'dark' ? 'text-gray-100 hover:bg-gray-600' : 'text-gray-800 hover:bg-gray-100'}`*/ `text-gray-800 hover:bg-gray-100`
                }`}
                        >
                            {}
                            <span className="text-xl mr-3">{lang.flag}</span>
                            {lang.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LanguageSwitcher;
