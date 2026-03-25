import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const Navigation: React.FC = () => {
    const { translations } = useLanguage();

    const navItems = [
        { id: 'aboutme', label: translations.aboutme },
        { id: 'skills', label: translations.skills },
        { id: 'projects', label: translations.projects },
        { id: 'contact', label: translations.contact }
    ];

    const handleSmoothScroll = (event: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        event.preventDefault();

        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <nav className={`sticky top-0 z-30 w-full p-4 shadow-md transition-colors duration-300 bg-white`}>
            <ul className="flex flex-wrap justify-center space-x-4 md:space-x-8">
                {navItems.map((item) => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            onClick={(e) => handleSmoothScroll(e, item.id)}
                            className={`text-lg font-semibold px-3 py-2 rounded-md transition-colors duration-300
                            text-gray-700 hover:text-primary hover:bg-blue-50`}
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navigation;
