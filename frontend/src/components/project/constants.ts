import type { statusTypes, updateTypes } from './types';

export const ITEMS_PER_PAGE = 10;
export const DESCRIPTION_SEPARATOR = '&&&&&&';
export const SECTION_SYMBOL = '\u00A7';
export const CODE_FENCE = SECTION_SYMBOL.repeat(6);
export const CHAPTER_PATTERN = /^\$(.+)\$$/;

export const statusColors: Record<statusTypes, string> = {
    regular: 'bg-gray-300 text-gray-800',
    refront: 'bg-yellow-200 text-yellow-800',
    major: 'bg-red-200 text-red-800',
    removed: 'bg-gray-500 text-white',
    corrected: 'bg-green-200 text-green-800',
    added: 'bg-blue-200 text-blue-800'
};

export const updateLabels: Record<updateTypes, string> = {
    next_update: 'Next Update',
    next_major_update: 'Next Major',
    next_version: 'Next Version',
    added: 'Added',
    abandoned: 'Abandoned'
};
