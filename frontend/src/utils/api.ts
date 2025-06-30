import axios from 'axios';
import { GIT_USERNAME } from '../config';

interface ChangelogEntry {
    date: string;
    version: string;
    changes: string[];
}

export type updateTypes = 'next_update' | 'next_major_update' | 'next_version' | 'added' | 'abandoned';
export type statusTypes = 'regular' | 'refront' | 'major' | 'removed' | 'corrected' | 'added';

interface TodosEntry {
    estimatedDate: string;
    update: updateTypes;
    status: statusTypes;
    changes: string[];
}

/**
 * @param githubLink The github project link.
 * @returns A resolved promise with the changelog.
 */
export const fetchChangelogs = async (githubLink: string): Promise<ChangelogEntry[]> => {
    const elements: ChangelogEntry[] = [];
    const text = githubLink.split('/');
    const name = text[text.length - 1];

    await axios
        .get(`https://raw.githubusercontent.com/${GIT_USERNAME}/${name}/main/CHANGELOG.md`)
        .then((data) => {
            const logs = data.data.split('&&&&&&');
            for (const log of logs) {
                const lines = log.split('\n');
                const start = lines[0] !== '' ? 0 : 1;
                elements.push({
                    date: lines[start],
                    version: lines[start + 1],
                    changes: lines.slice(start + 2, lines.length - 1)
                });
            }
        })
        .catch(() => {
            return [];
        });

    return elements;
};

/**
 * @param githubLink The github project link.
 * @returns A resolved promise with the changelog.
 */
export const fetchTodos = async (githubLink: string): Promise<TodosEntry[]> => {
    const elements: TodosEntry[] = [];
    const text = githubLink.split('/');
    const name = text[text.length - 1];

    await axios
        .get(`https://raw.githubusercontent.com/${GIT_USERNAME}/${name}/main/TODO.md`)
        .then((data) => {
            const logs = data.data.split('&&&&&&');
            for (const log of logs) {
                const lines = log.split('\n');
                const start = lines[0] !== '' ? 0 : 1;
                elements.push({
                    estimatedDate: lines[start],
                    update: lines[start + 1] as updateTypes,
                    status: lines[start + 2] as statusTypes,
                    changes: lines.slice(start + 3, lines.length - 1)
                });
            }
        })
        .catch(() => {
            return [];
        });

    return elements;
};
