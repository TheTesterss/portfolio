import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { PROJECTS_CONFIG } from '../../config';
import { useLanguage } from '../../contexts/LanguageContext';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { fetchChangelogs, fetchTodos } from '../../utils/api';
import { ITEMS_PER_PAGE, statusColors, updateLabels } from './constants';
import ProjectSelector from './ProjectSelector';
import type { ApiRequestTest, ChangelogEntry, ExternalLinkTest, MemoryInterpreterTest, Project, TodosEntry } from './types';
import {
    ApiRequestTestPanel,
    ExternalLinkTestPanel,
    MemoryInterpreterTestPanel,
    parseDescriptionChapters,
    parseDescriptionParts,
    renderDescriptionPart,
    scrollInfoContainerToChapter
} from './renderers';

const ProjectSection: React.FC = () => {
    const { translations, language } = useLanguage();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [previewImg, setPreviewImg] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState<'todo' | 'changelog' | 'info' | 'tests'>('changelog');
    const [selectedChapter, setSelectedChapter] = useState(0);
    const [selectedTestIndex, setSelectedTestIndex] = useState(0);

    const [changelogs, setChangelogs] = useState<ChangelogEntry[]>([]);
    const [changelogLoading, setChangelogLoading] = useState(false);
    const [changelogPage, setChangelogPage] = useState(1);

    const [todos, setTodos] = useState<TodosEntry[]>([]);
    const [todoLoading, setTodoLoading] = useState(false);
    const [todoPage, setTodoPage] = useState(1);

    const sectionRef = useScrollAnimation();
    const infoScrollRef = useRef<HTMLDivElement>(null);

    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };

    const langs: { [key: string]: string } = {
        fr: 'fr-FR',
        en: 'en-UK'
    };

    useEffect(() => {
        if (PROJECTS_CONFIG.length > 0 && !selectedProject) {
            setSelectedProject(PROJECTS_CONFIG[0]);
        }
    }, [selectedProject]);

    useEffect(() => {
        if (selectedProject && selectedTab === 'changelog') {
            setChangelogLoading(true);
            setChangelogs([]);
            setChangelogPage(1);
            fetchChangelogs(selectedProject.githubLink)
                .then((data) => setChangelogs(data))
                .catch(() => setChangelogs([]))
                .finally(() => setChangelogLoading(false));
        }
    }, [selectedProject, selectedTab]);

    useEffect(() => {
        if (selectedProject && selectedTab === 'todo') {
            setTodoLoading(true);
            setTodos([]);
            setTodoPage(1);
            fetchTodos(selectedProject.githubLink)
                .then((data) => setTodos(data))
                .catch(() => setTodos([]))
                .finally(() => setTodoLoading(false));
        }
    }, [selectedProject, selectedTab]);

    useEffect(() => {
        if (previewImg) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [previewImg]);

    const changelogTotalPages = Math.ceil(changelogs.length / ITEMS_PER_PAGE);
    const todoTotalPages = Math.ceil(todos.length / ITEMS_PER_PAGE);

    const currentChangelogs = changelogs.slice((changelogPage - 1) * ITEMS_PER_PAGE, changelogPage * ITEMS_PER_PAGE);
    const currentTodos = todos.slice((todoPage - 1) * ITEMS_PER_PAGE, todoPage * ITEMS_PER_PAGE);
    const infoLabel = language === 'fr' ? 'Informations' : 'Information';
    const testsLabel = language === 'fr' ? 'Tests' : 'Tests';
    const selectedTests = selectedProject?.tests ?? [];
    const hasTests = selectedTests.length > 0;
    const selectedTest = hasTests ? selectedTests[Math.min(selectedTestIndex, selectedTests.length - 1)] : null;
    const infoDescription = selectedProject
        ? language === 'fr'
            ? selectedProject.description_fr
            : selectedProject.description
        : '';
    const infoParts = selectedProject ? parseDescriptionParts(infoDescription, selectedProject.images) : [];
    const infoChapters = selectedProject ? parseDescriptionChapters(infoDescription, selectedProject.images) : [];

    useEffect(() => {
        setSelectedChapter(0);
        setSelectedTestIndex(0);
    }, [selectedProject, language]);

    useEffect(() => {
        if (selectedTab === 'tests' && !hasTests) {
            setSelectedTab('info');
        }
    }, [hasTests, selectedTab]);

    useEffect(() => {
        if (selectedTestIndex >= selectedTests.length) {
            setSelectedTestIndex(0);
        }
    }, [selectedTestIndex, selectedTests]);

    useEffect(() => {
        if (!infoScrollRef.current || infoChapters.length === 0) {
            return;
        }

        const root = infoScrollRef.current;
        const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-chapter-index]'));

        if (sections.length === 0) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => Number(a.target.getAttribute('data-chapter-index')) - Number(b.target.getAttribute('data-chapter-index')));

                if (visibleEntries.length > 0) {
                    setSelectedChapter(Number(visibleEntries[0].target.getAttribute('data-chapter-index')));
                }
            },
            {
                root,
                threshold: 0.2,
                rootMargin: '-10% 0px -60% 0px'
            }
        );

        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
            observer.disconnect();
        };
    }, [infoChapters]);

    return (
        <section ref={sectionRef} className="animate-on-scroll">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">{translations.projects}</h2>
            <div className="flex flex-col md:flex-row gap-8 pb-28">
                <div className="w-full md:w-[22rem] md:flex-shrink-0 p-6 rounded-lg shadow-md bg-white">
                    <h3 className="text-2xl font-semibold mb-6 text-gray-700">{translations.selectProject}</h3>
                    <div className="max-h-[22rem] overflow-y-auto pr-2">
                        <ProjectSelector selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
                    </div>
                </div>
                <div className="min-w-0 flex-1 p-6 rounded-lg shadow-md bg-white">
                    <div className="mb-4 flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedTab('todo')}
                            className={`px-4 py-2 rounded-t-md font-semibold transition-colors duration-200 ${
                                selectedTab === 'todo'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                            }`}
                        >
                            TODO
                        </button>
                        <button
                            onClick={() => setSelectedTab('changelog')}
                            className={`px-4 py-2 rounded-t-md font-semibold transition-colors duration-200 ${
                                selectedTab === 'changelog'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                            }`}
                        >
                            CHANGELOG
                        </button>
                        <button
                            onClick={() => setSelectedTab('info')}
                            className={`px-4 py-2 rounded-t-md font-semibold transition-colors duration-200 ${
                                selectedTab === 'info'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                            }`}
                        >
                            {infoLabel}
                        </button>
                        {hasTests && (
                            <button
                                onClick={() => setSelectedTab('tests')}
                                className={`px-4 py-2 rounded-t-md font-semibold transition-colors duration-200 ${
                                    selectedTab === 'tests'
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                                }`}
                            >
                                {testsLabel}
                            </button>
                        )}
                    </div>
                    {selectedTab === 'todo' && (
                        <div className="max-h-[22rem] overflow-y-auto pr-2">
                            <h3 className="text-xl font-bold mb-4">TODO</h3>
                            {todoLoading ? (
                                <div className="text-center py-8">
                                    <i className="fas fa-spinner fa-spin text-4xl text-primary"></i>
                                    <p className="mt-4 text-gray-600">Chargement des TODOs...</p>
                                </div>
                            ) : currentTodos.length === 0 ? (
                                <p className="text-center py-8 text-gray-500">Aucune tâche à afficher.</p>
                            ) : (
                                <>
                                    {currentTodos.map((entry, idx) => (
                                        <div key={idx} className="mb-6 p-4 rounded-md bg-gray-50">
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[entry.status]}`}>
                                                    {entry.status}
                                                </span>
                                                <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-semibold">
                                                    {updateLabels[entry.update]}
                                                </span>
                                                {entry.estimatedDate && (
                                                    <span className="px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs font-semibold">
                                                        {new Date(entry.estimatedDate).toLocaleDateString(langs[language], options)}
                                                    </span>
                                                )}
                                            </div>
                                            <ul className="list-disc list-inside space-y-1">
                                                {entry.changes?.map((change, i) => (
                                                    <li key={i} className="text-gray-700">
                                                        {change}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                    {todoTotalPages > 1 && (
                                        <div className="flex justify-center items-center mt-8 space-x-2">
                                            <button
                                                onClick={() => setTodoPage(todoPage - 1)}
                                                disabled={todoPage === 1}
                                                className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                                                    todoPage === 1
                                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                        : 'bg-primary text-white hover:bg-blue-600'
                                                }`}
                                            >
                                                {translations.previous}
                                            </button>
                                            {Array.from({ length: todoTotalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => setTodoPage(page)}
                                                    className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                                                        todoPage === page
                                                            ? 'bg-blue-700 text-white font-bold'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => setTodoPage(todoPage + 1)}
                                                disabled={todoPage === todoTotalPages}
                                                className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                                                    todoPage === todoTotalPages
                                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                        : 'bg-primary text-white hover:bg-blue-600'
                                                }`}
                                            >
                                                {translations.next}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                    {selectedTab === 'changelog' && (
                        <div className="max-h-[22rem] overflow-y-auto pr-2">
                            <h3 className="text-2xl font-semibold mb-6 text-gray-700">
                                {selectedProject
                                    ? `${translations.changelogFor} ${selectedProject.name}`
                                    : translations.selectAProject}
                            </h3>
                            {changelogLoading ? (
                                <div className="text-center py-8">
                                    <i className="fas fa-spinner fa-spin text-4xl text-primary"></i>
                                    <p className="mt-4 text-gray-600">{translations.loadingChangelogs}</p>
                                </div>
                            ) : currentChangelogs.length === 0 ? (
                                <p className="text-center py-8 text-gray-500">
                                    {selectedProject
                                        ? translations.noChangelogsFound
                                        : translations.selectAProjectToViewChangelogs}
                                </p>
                            ) : (
                                <>
                                    {currentChangelogs.map((entry, index) => (
                                        <div key={index} className="mb-6 p-4 rounded-md bg-gray-50">
                                            <p className="text-lg font-semibold mb-2 text-blue-600">
                                                {translations.version} {entry.version} -{' '}
                                                {new Date(entry.date).toLocaleDateString(langs[language], options)}
                                            </p>
                                            <ul className="list-disc list-inside space-y-1">
                                                {entry.changes.map((change, i) => (
                                                    <li key={i} className="text-gray-700">
                                                        {change}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                    {changelogTotalPages > 1 && (
                                        <div className="flex justify-center items-center mt-8 space-x-2">
                                            <button
                                                onClick={() => setChangelogPage(changelogPage - 1)}
                                                disabled={changelogPage === 1}
                                                className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                                                    changelogPage === 1
                                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                        : 'bg-primary text-white hover:bg-blue-600'
                                                }`}
                                            >
                                                {translations.previous}
                                            </button>
                                            {Array.from({ length: changelogTotalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => setChangelogPage(page)}
                                                    className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                                                        changelogPage === page
                                                            ? 'bg-blue-700 text-white font-bold'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => setChangelogPage(changelogPage + 1)}
                                                disabled={changelogPage === changelogTotalPages}
                                                className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                                                    changelogPage === changelogTotalPages
                                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                        : 'bg-primary text-white hover:bg-blue-600'
                                                }`}
                                            >
                                                {translations.next}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                    {selectedTab === 'tests' && selectedProject && hasTests && (
                        <div className="max-h-[26rem] overflow-y-auto pr-2">
                            <div className="space-y-4">
                                {selectedTests.length > 1 && (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTests.map((test, index) => (
                                            <button
                                                key={`${test.type}-${index}`}
                                                type="button"
                                                onClick={() => setSelectedTestIndex(index)}
                                                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                                                    selectedTestIndex === index
                                                        ? 'border-blue-600 bg-blue-600 text-white'
                                                        : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                }`}
                                            >
                                                {language === 'fr' ? test.title_fr : test.title}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {selectedTest?.type === 'memory_interpreter' && (
                                    <MemoryInterpreterTestPanel test={selectedTest as MemoryInterpreterTest} language={language} />
                                )}
                                {selectedTest?.type === 'api_request' && (
                                    <ApiRequestTestPanel test={selectedTest as ApiRequestTest} language={language} />
                                )}
                                {selectedTest?.type === 'external_link' && (
                                    <ExternalLinkTestPanel test={selectedTest as ExternalLinkTest} language={language} />
                                )}
                            </div>
                        </div>
                    )}
                    {selectedTab === 'info' && selectedProject && (
                        <div className="relative flex min-h-[350px] w-full flex-col items-start">
                            {infoChapters.length > 0 && (
                                <div className="sticky top-0 z-10 mb-4 w-full overflow-x-auto rounded-2xl bg-white pb-2">
                                    <div className="flex min-w-max gap-2">
                                        {infoChapters.map((chapter, chapterIndex) => (
                                            <button
                                                key={`chapter-tab-${chapterIndex}`}
                                                type="button"
                                                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                                                    selectedChapter === chapterIndex
                                                        ? 'border-blue-600 bg-blue-600 text-white'
                                                        : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                }`}
                                                onClick={() => {
                                                    setSelectedChapter(chapterIndex);
                                                    scrollInfoContainerToChapter(infoScrollRef.current, chapterIndex);
                                                }}
                                            >
                                                {chapter.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div ref={infoScrollRef} className="w-full max-h-[26rem] space-y-6 overflow-y-auto pr-2">
                                {infoChapters.length > 0 ? (
                                    infoChapters.map((chapter, chapterIndex) => (
                                        <section
                                            key={`chapter-${chapterIndex}`}
                                            data-chapter-index={chapterIndex}
                                            className="space-y-6 scroll-mt-24"
                                        >
                                            {chapterIndex > 0 && (
                                                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                                            )}
                                            {chapter.parts.map((part, partIndex) =>
                                                renderDescriptionPart(
                                                    part,
                                                    `chapter-${chapterIndex}-part-${partIndex}`,
                                                    language,
                                                    (img) => setPreviewImg(img)
                                                )
                                            )}
                                        </section>
                                    ))
                                ) : infoParts.length === 0 ? (
                                    <p className="rounded-lg bg-gray-50 p-5 text-gray-800 shadow">
                                        {language === 'fr' ? 'Description à venir...' : 'Description coming soon...'}
                                    </p>
                                ) : (
                                    infoParts.map((part, partIndex) =>
                                        renderDescriptionPart(part, `info-${partIndex}`, language, (img) => setPreviewImg(img))
                                    )
                                )}
                            </div>
                            <div className="mt-2 flex w-full">
                                <a
                                    href={selectedProject.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-blue-700 text-lg underline hover:text-blue-900 mt-2"
                                    style={{ marginLeft: 0 }}
                                >
                                    {language === 'fr' ? 'Voir sur GitHub' : 'View on GitHub'}
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {previewImg &&
                ReactDOM.createPortal(
                    <div
                        className="fixed inset-0 z-[9999] flex items-center justify-center w-screen h-screen pointer-events-auto"
                        style={{ background: 'rgba(200,200,200,0.6)' }}
                        onClick={() => setPreviewImg(null)}
                    >
                        <div
                            className="relative bg-white rounded-lg shadow-lg p-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setPreviewImg(null)}
                                className="absolute top-2 right-2 text-gray-700 text-3xl font-bold z-10 hover:text-red-400"
                                aria-label="Fermer"
                            >
                                X
                            </button>
                            <img
                                src={previewImg}
                                alt="Agrandissement"
                                className="max-h-[80vh] max-w-[90vw] rounded-lg"
                            />
                        </div>
                    </div>,
                    document.body
                )}
        </section>
    );
};

export default ProjectSection;
