import React, { useState, useEffect } from 'react';
import { PROJECTS_CONFIG } from '../config';
import { fetchChangelogs, fetchTodos } from '../utils/api';
import { useLanguage } from '../contexts/LanguageContext';
import ProjectSelector from './ProjectSelector';
import ReactDOM from 'react-dom';
import useScrollAnimation from '../hooks/useScrollAnimation';

export type updateTypes = 'next_update' | 'next_major_update' | 'next_version' | 'added' | 'abandoned';
export type statusTypes = 'regular' | 'refront' | 'major' | 'removed' | 'corrected' | 'added';

interface ChangelogEntry {
    date: string;
    version: string;
    changes: string[];
}

interface TodosEntry {
    estimatedDate: string;
    update: updateTypes;
    status: statusTypes;
    changes: string[];
}

interface Project {
    name: string;
    category: string;
    githubLink: string;
    description: string;
    images: string[];
}

const ITEMS_PER_PAGE = 10;

const statusColors: Record<statusTypes, string> = {
    regular: 'bg-gray-300 text-gray-800',
    refront: 'bg-yellow-200 text-yellow-800',
    major: 'bg-red-200 text-red-800',
    removed: 'bg-gray-500 text-white',
    corrected: 'bg-green-200 text-green-800',
    added: 'bg-blue-200 text-blue-800'
};

const updateLabels: Record<updateTypes, string> = {
    next_update: 'Next Update',
    next_major_update: 'Next Major',
    next_version: 'Next Version',
    added: 'Added',
    abandoned: 'Abandoned'
};

const Project: React.FC = () => {
    const { translations } = useLanguage();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [previewImg, setPreviewImg] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState<'todo' | 'changelog' | 'info'>('changelog');

    const [changelogs, setChangelogs] = useState<ChangelogEntry[]>([]);
    const [changelogLoading, setChangelogLoading] = useState(false);
    const [changelogPage, setChangelogPage] = useState(1);

    const [todos, setTodos] = useState<TodosEntry[]>([]);
    const [todoLoading, setTodoLoading] = useState(false);
    const [todoPage, setTodoPage] = useState(1);

    const sectionRef = useScrollAnimation();
    const language = localStorage.getItem('language') ?? 'fr';

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

    return (
        <section ref={sectionRef} className="animate-on-scroll">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">{translations.projects}</h2>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/4 p-6 rounded-lg shadow-md bg-white">
                    <h3 className="text-2xl font-semibold mb-6 text-gray-700">{translations.selectProject}</h3>
                    <ProjectSelector selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
                </div>
                <div className="w-full md:w-3/4 p-6 rounded-lg shadow-md bg-white">
                    <div className="flex gap-2 mb-4">
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
                            Infos
                        </button>
                    </div>
                    {selectedTab === 'todo' && (
                        <div>
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
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[entry.status]}`}
                                                >
                                                    {entry.status}
                                                </span>
                                                <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-semibold">
                                                    {updateLabels[entry.update]}
                                                </span>
                                                {entry.estimatedDate && (
                                                    <span className="px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs font-semibold">
                                                        {new Date(entry.estimatedDate).toLocaleDateString(
                                                            langs[language],
                                                            options
                                                        )}
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
                                                className={`px-4 py-2 rounded-md transition-colors duration-300
                                                    ${
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
                                                    className={`px-4 py-2 rounded-md transition-colors duration-300
                                                        ${
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
                                                className={`px-4 py-2 rounded-md transition-colors duration-300
                                                    ${
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
                        <>
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
                                                className={`px-4 py-2 rounded-md transition-colors duration-300
                                                    ${
                                                        changelogPage === 1
                                                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                            : 'bg-primary text-white hover:bg-blue-600'
                                                    }`}
                                            >
                                                {translations.previous}
                                            </button>
                                            {Array.from({ length: changelogTotalPages }, (_, i) => i + 1).map(
                                                (page) => (
                                                    <button
                                                        key={page}
                                                        onClick={() => setChangelogPage(page)}
                                                        className={`px-4 py-2 rounded-md transition-colors duration-300
                                                        ${
                                                            changelogPage === page
                                                                ? 'bg-blue-700 text-white font-bold'
                                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                )
                                            )}
                                            <button
                                                onClick={() => setChangelogPage(changelogPage + 1)}
                                                disabled={changelogPage === changelogTotalPages}
                                                className={`px-4 py-2 rounded-md transition-colors duration-300
                                                    ${
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
                        </>
                    )}
                    {selectedTab === 'info' && selectedProject && (
                        <div className="flex flex-col items-start relative min-h-[350px]">
                            <p className="mb-4 p-4 rounded-lg shadow bg-gray-50 text-gray-800 w-full">
                                {selectedProject.description || 'Description à venir...'}
                            </p>
                            {selectedProject.images && selectedProject.images.length > 0 && (
                                <div className="flex flex-wrap gap-6 mb-4 w-full">
                                    {selectedProject.images.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`project-img-${idx}`}
                                            className="h-56 w-56 object-cover rounded-lg shadow border cursor-pointer transition-transform hover:scale-105"
                                            onClick={() => setPreviewImg(img)}
                                        />
                                    ))}
                                </div>
                            )}
                            <div className="w-full flex">
                                <a
                                    href={selectedProject.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-blue-700 text-lg underline hover:text-blue-900 mt-2"
                                    style={{ marginLeft: 0 }}
                                >
                                    Visiter le projet
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
                                ×
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

export default Project;
