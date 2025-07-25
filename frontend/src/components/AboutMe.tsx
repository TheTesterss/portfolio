import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { timelineData } from '../config';

const colorMap: Record<string, string> = {
    'red-500': 'bg-red-500',
    'green-500': 'bg-green-500',
    'cyan-500': 'bg-cyan-500',
    'magenta-500': 'bg-pink-600',
    'blue-500': 'bg-blue-500',
    'pink-500': 'bg-pink-500',
    'orange-500': 'bg-orange-500',
    'gray-300': 'bg-gray-300',
    'yellow-500': 'bg-yellow-500'
};

function getTimelineLayout(length: number, selectedIdx: number, width: number) {
    if (width > 1100 || length <= 8) {
        return [[...Array(length).keys()]];
    }
    if (width > 700) {
        let firstLine = [],
            secondLine = [];
        if (selectedIdx < 5) {
            firstLine = [...Array(5).keys()];
            secondLine = [...Array(length - 5).keys()].map((i) => i + 5);
        } else {
            firstLine = [...Array(length - 5).keys()];
            secondLine = [...Array(5).keys()].map((i) => i + length - 5);
        }
        return [firstLine, secondLine];
    }
    let lines = [];
    if (selectedIdx < 3) {
        lines = [[0, 1, 2], [3, 4, 5, 6], [7, 8, 9, 10].filter((i) => i < length)];
    } else if (selectedIdx < 7) {
        lines = [[0, 1, 2, 3], [4, 5, 6], [7, 8, 9, 10].filter((i) => i < length)];
    } else {
        lines = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10].filter((i) => i < length)];
    }
    
    return lines;
}

export default function AboutMe() {
    const { translations, language } = useLanguage();
    const [selectedIdx, setSelectedIdx] = useState<number>(0);
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const lines = getTimelineLayout(timelineData.length, selectedIdx, windowWidth);

    return (
        <section className="my-8 px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">{translations.aboutme}</h2>
            <p className="text-gray-700 leading-relaxed">{translations.descriptions}</p>

            <div className="w-full flex flex-col items-center mt-12 gap-8">
                {lines.map((line, lineIdx) => (
                    <div key={lineIdx} className="relative w-full max-w-5xl flex flex-col items-center mb-2">
                        <div
                            className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 z-0"
                            style={{ transform: 'translateY(-50%)' }}
                        />
                        <div className="flex w-full justify-between z-10">
                            {line.map((idx) => {
                                const event = timelineData[idx];
                                const isSelected = selectedIdx === idx;
                                return (
                                    <div key={event.date} className="flex flex-col items-center group relative">
                                        <button
                                            onClick={() => setSelectedIdx(idx)}
                                            className={`
                                                flex items-center justify-center
                                                transition-transform duration-200
                                                ${isSelected ? 'scale-125' : 'hover:scale-110'}
                                                focus:outline-none
                                            `}
                                            aria-label={event.title?.[language] || event.title?.fr}
                                        >
                                            <span
                                                className={`
                                                    w-7 h-7 rounded-full border-4 border-white shadow
                                                    transition-all duration-200
                                                    ${
                                                        isSelected
                                                            ? 'bg-blue-600 border-blue-300'
                                                            : `${colorMap[event.color] || 'bg-gray-200'} border-gray-200`
                                                    }
                                                `}
                                                style={{
                                                    backgroundColor: isSelected ? '#2563eb' : undefined,
                                                    borderColor: isSelected ? '#2563eb' : undefined
                                                }}
                                            />
                                            {isSelected && (
                                                <svg
                                                    className="absolute right-[-28px] top-1/2 -translate-y-1/2"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M5 12h14M13 6l6 6-6 6"
                                                        stroke="#2563eb"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                        <span
                                            className={`mt-2 text-xs text-gray-700 whitespace-nowrap ${isSelected ? 'font-bold text-blue-700' : ''}`}
                                        >
                                            {event.date}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
                {selectedIdx !== null && (
                    <div className="mt-10 max-w-xl w-full bg-white rounded-xl shadow-lg p-8 border border-blue-100 text-center transition-all duration-300">
                        <h4 className="text-2xl font-bold mb-4 text-blue-700">
                            {timelineData[selectedIdx].title?.[language] || timelineData[selectedIdx].title?.fr}
                        </h4>
                        <p className="text-gray-700 text-lg">
                            {timelineData[selectedIdx].description?.[language] ||
                                timelineData[selectedIdx].description?.fr}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
