import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface CookieConsentProps {
    onAccept: () => void;
    onDecline: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline }) => {
    const { translations } = useLanguage();

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 p-6 rounded-lg shadow-2xl max-w-sm
            bg-white text-gray-900 border border-gray-200`}
        >
            <h3 className={`text-xl font-bold mb-3 text-blue-600`}>{translations.cookieConsentTitle}</h3>
            <p className={`mb-4 text-sm text-gray-700`}>{translations.cookieConsentText}</p>
            <div className="flex justify-end space-x-3">
                <button
                    onClick={onDecline}
                    className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200
                    bg-gray-200 hover:bg-gray-300 text-gray-800`}
                >
                    {translations.decline}
                </button>
                <button
                    onClick={onAccept}
                    className="px-4 py-2 rounded-md bg-primary text-white font-semibold hover:bg-blue-600 transition-colors duration-200"
                >
                    {translations.accept}
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;
