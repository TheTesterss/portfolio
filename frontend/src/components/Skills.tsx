import React from 'react';
import skillsData from '../data/skills.json';
import { useLanguage } from '../contexts/LanguageContext';
// import { useTheme } from '../contexts/ThemeContext';

import useScrollAnimation from '../hooks/useScrollAnimation';

interface Skill {
    id: string;
    name: string;
    icon: string;
    type: string;
    description: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

const Skills: React.FC = () => {
    const { translations } = useLanguage();
    // const { theme } = useTheme();
    const sectionRef = useScrollAnimation();

    const categories = Array.from(new Set(skillsData.map((skill) => skill.type)));

    const getLevelColor = (level: Skill['level']) => {
        switch (level) {
            case 'beginner':
                return 'text-gray-500';
            case 'intermediate':
                return 'text-yellow-500';
            case 'advanced':
                return 'text-blue-500';
            case 'expert':
                return 'text-green-500';
            default:
                return 'text-gray-400';
        }
    };

    return (
        <section ref={sectionRef} className="animate-on-scroll">
            <h2
                // className={`text-4xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-primary' : 'text-gray-800'}`}
                className={`text-4xl font-bold text-center mb-12 text-gray-800`}
            >
                {translations.mySkills}
            </h2>

            {categories.map((category) => (
                <div key={category} className="mb-10">
                    <h3
                        // className={`text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} border-b pb-2`}
                        className={`text-2xl font-semibold mb-6 text-gray-700 border-b pb-2`}
                    >
                        {translations[category as keyof typeof translations] || category}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {skillsData
                            .filter((skill) => skill.type === category)
                            .map((skill) => (
                                <div
                                    key={skill.id}
                                    // className={`flex flex-col items-center p-4 rounded-lg shadow-md cursor-pointer transition-all duration-300
                                    //   ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'}
                                    // transform hover:-translate-y-1`}
                                    className={`flex flex-col items-center p-4 rounded-lg shadow-md cursor-pointer transition-all duration-300
                                    bg-white hover:bg-gray-100 transform hover:-translate-y-1`}
                                >
                                    {}
                                    <i
                                        // className={`text-5xl mb-3 ${
                                        // skill.icon.includes('devicon') ? '' : 'fa-fw'
                                        // } ${skill.icon} ${theme === 'dark' ? 'text-primary' : 'text-blue-600'}`}
                                        className={`text-5xl mb-3 ${
                                            skill.icon.includes('devicon') ? '' : 'fa-fw'
                                        } ${skill.icon} text-blue-600`}
                                    />
                                    <span
                                        // className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
                                        className={`text-lg font-medium text-gray-800`}
                                    >
                                        {skill.name}
                                    </span>
                                    <span
                                        className={`text-sm ${getLevelColor(skill.level as 'expert' | 'beginner' | 'intermediate' | 'advanced')}`}
                                    >
                                        {translations[skill.level as keyof typeof translations]}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </section>
    );
};

export default Skills;
