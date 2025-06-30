import { useState } from 'react';
import { PROJECTS_CONFIG } from '../config';
import clsx from 'clsx';

const categories = [
    { key: 'web', label: 'Web' },
    { key: 'interpreter', label: 'Interpreters' },
    { key: 'discord', label: 'Discord' },
    { key: 'misc', label: 'Divers' }
];

type Project = (typeof PROJECTS_CONFIG)[number];

interface ProjectSelectorProps {
    selectedProject: Project | null;
    setSelectedProject: (project: Project) => void;
}

export default function ProjectSelector({ selectedProject, setSelectedProject }: ProjectSelectorProps) {
    const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({
        web: true,
        interpreter: false,
        discord: false,
        misc: false
    });

    const toggleCategory = (cat: string) => {
        setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
    };

    return (
        <ul>
            {categories.map((cat) => {
                const projects = PROJECTS_CONFIG.filter((p) => p.category === cat.key);
                if (projects.length === 0) return null;
                return (
                    <li key={cat.key} className="mb-2">
                        <button
                            type="button"
                            onClick={() => toggleCategory(cat.key)}
                            className="flex items-center w-full text-left font-semibold"
                        >
                            <span
                                className={clsx(
                                    'mr-2 transition-transform',
                                    openCategories[cat.key] ? 'rotate-90' : '',
                                    'text-blue-600' // Ajoute cette classe pour la couleur bleue
                                )}
                            >
                                ▶
                            </span>
                            {cat.label}
                        </button>
                        {openCategories[cat.key] && (
                            <ul className="ml-6 mt-1">
                                {projects.map((project) => (
                                    <li key={project.name}>
                                        <button
                                            onClick={() => setSelectedProject(project)}
                                            className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-300 ${
                                                selectedProject?.name === project.name
                                                    ? 'bg-primary text-white shadow-lg'
                                                    : 'text-gray-700 hover:bg-blue-50'
                                            }`}
                                        >
                                            {project.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
