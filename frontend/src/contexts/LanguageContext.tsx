import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import translationsData from '../data/translations.json';

export type Language = 'fr' | 'en';

interface Translations {
    [key: string]: {
        [lang: string]: string;
    };
}

interface LanguageContextType {
    language: Language;
    translations: { [key: string]: string };
    changeLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        const savedLang = localStorage.getItem('language') as Language;
        return savedLang || 'fr';
    });

    const [translations, setTranslations] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const currentTranslations: { [key: string]: string } = {};
        for (const key in translationsData) {
            if (translationsData.hasOwnProperty(key)) {
                currentTranslations[key] = (translationsData as Translations)[key][language] || key;
            }
        }
        setTranslations(currentTranslations);
        localStorage.setItem('language', language);
    }, [language]);

    const changeLanguage = (lang: Language) => {
        setLanguage(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, translations, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
