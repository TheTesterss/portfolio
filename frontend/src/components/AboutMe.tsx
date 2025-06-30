import { useLanguage } from '../contexts/LanguageContext';

export default function AboutMe() {
    const { translations } = useLanguage();
    return (
        <section className="my-8 px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">{translations.aboutme}</h2>
            <p className="text-gray-700 leading-relaxed">{translations.descriptions}</p>
        </section>
    );
}
