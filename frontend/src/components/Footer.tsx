import React from 'react';
// import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { AUTHOR_NAME, USERNAME } from '../config';

const Footer: React.FC = () => {
    // const { theme } = useTheme();
    const { translations } = useLanguage();

    const currentYear = new Date().getFullYear();

    return (
        <footer
            // className={`py-8 px-4 text-center rounded-t-lg shadow-inner mt-12
            // ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-blue-100 text-gray-600'}`}
            className={`py-8 px-4 text-center rounded-t-lg shadow-inner mt-12
            bg-blue-100 text-gray-600`}
        >
            <div className="container mx-auto">
                <p className="text-lg font-medium mb-2">
                    &copy; {currentYear} {AUTHOR_NAME} - {USERNAME}
                </p>
                <div className="flex justify-center space-x-4 mt-4">
                    {}
                    <a
                        href="/privacy"
                        // className={`hover:text-primary transition-colors duration-200 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                        className={`hover:text-primary transition-colors duration-200 text-gray-600`}
                    >
                        {translations.privacyPolicy}
                    </a>
                    {/* <span className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>|</span> */}
                    <span className={`text-gray-400`}>|</span>
                    <a href="/terms" className={`hover:text-primary transition-colors duration-200text-gray-600`}>
                        {translations.termsOfService}
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
