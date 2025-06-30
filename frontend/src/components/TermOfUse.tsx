import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function TermsOfUse() {
    const navigate = useNavigate();
    const { translations } = useLanguage();
    return (
        <main className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">{translations.termsOfService}</h2>
            <p className="max-w-xl text-center">{translations['termsContent']}</p>
            <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-10"
            >
                Come back
            </button>
        </main>
    );
}
