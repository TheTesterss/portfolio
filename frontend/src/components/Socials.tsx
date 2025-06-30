import React, { useEffect, useState } from 'react';
import socialLinksData from '../data/socialLinks.json';
import { useLanguage } from '../contexts/LanguageContext';
// import { useTheme } from '../contexts/ThemeContext';
import useScrollAnimation from '../hooks/useScrollAnimation';

// interface SocialLink {
// platform: string;
// url: string;
// icon: string;
// color: string;
// username?: string;
// labelKey: string;
// }

const Socials: React.FC = () => {
    const { translations } = useLanguage();
    // const { theme } = useTheme();
    const [socialStats, setSocialStats] = useState<{
        [key: string]: number | undefined;
    }>({});
    const sectionRef = useScrollAnimation();

    useEffect(() => {
        const loadSocialStats = async () => {
            const stats: { [key: string]: number | undefined } = {};
            for (const link of socialLinksData) {
                if (link.username) {
                    try {
                        const count = 0;
                        stats[link.platform] = count;
                    } catch (error) {
                        console.error(`Failed to fetch stats for ${link.platform}:`, error);
                        stats[link.platform] = undefined;
                    }
                }
            }
            setSocialStats(stats);
        };

        loadSocialStats();
    }, []);

    return (
        <section ref={sectionRef} className="animate-on-scroll">
            <h2
                // className={`text-4xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-primary' : 'text-gray-800'}`}
                className={`text-4xl font-bold text-center mb-12 text-gray-800`}
            >
                {translations.mySocials}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {socialLinksData.map((link, index) => (
                    <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        // className={`flex items-center p-6 rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-2
                        // ${theme === 'dark' ? 'bg-white hover:bg-gray-100' :'bg-white hover:bg-gray-100'}`}
                        className={`flex items-center p-6 rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-2
                        bg-white hover:bg-gray-100`}
                    >
                        <i className={`text-5xl mr-6 ${link.icon} text-blue-600`}></i>
                        <div>
                            <h3
                                // className={`text-2xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
                                className={`text-2xl font-semibold mb-2 text-gray-800`}
                            >
                                {link.platform}
                            </h3>
                            {link.username && (
                                // <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <p className={`text-lg text-gray-600`}>
                                    {socialStats[link.platform] !== null
                                        ? `${socialStats[link.platform]} ${translations[link.labelKey as keyof typeof translations]}`
                                        : translations.loadingStats}
                                </p>
                            )}
                            <p className={`text-sm ${link.color} text-blue-600`}>
                                {link.platform === 'discord' ? translations.joinServer : translations.visitProfile}
                            </p>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default Socials;
