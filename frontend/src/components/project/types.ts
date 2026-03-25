import type { ApiRequestTestConfig, ExternalLinkTestConfig, MemoryInterpreterTestConfig, ProjectConfig } from '../../config';

export type updateTypes = 'next_update' | 'next_major_update' | 'next_version' | 'added' | 'abandoned';
export type statusTypes = 'regular' | 'refront' | 'major' | 'removed' | 'corrected' | 'added';

export interface ChangelogEntry {
    date: string;
    version: string;
    changes: string[];
}

export interface TodosEntry {
    estimatedDate: string;
    update: updateTypes;
    status: statusTypes;
    changes: string[];
}

export type Project = ProjectConfig;
export type MemoryInterpreterTest = MemoryInterpreterTestConfig;
export type ApiRequestTest = ApiRequestTestConfig;
export type ExternalLinkTest = ExternalLinkTestConfig;

export interface DescriptionTextPart {
    type: 'text';
    value: string;
}

export interface DescriptionImagePart {
    type: 'images';
    images: string[];
}

export interface DescriptionCollapsePart {
    type: 'collapse';
    title: string;
    parts: DescriptionPart[];
}

export interface DescriptionSectionPart {
    type: 'section';
    parts: DescriptionPart[];
}

export interface DescriptionSpacerPart {
    type: 'spacer';
    height: number;
}

export interface DescriptionChapter {
    title: string;
    parts: DescriptionPart[];
}

export interface ParsedTextSegment {
    type: 'text';
    value: string;
}

export interface ParsedCodeSegment {
    type: 'code';
    value: string;
    language: string;
}

export interface CustomGuideSegment {
    depth: number;
    topOffset: boolean;
    bottomOffset: boolean;
}

export type DescriptionPart =
    | DescriptionTextPart
    | DescriptionImagePart
    | DescriptionCollapsePart
    | DescriptionSectionPart
    | DescriptionSpacerPart;

export type ParsedTextContent = ParsedTextSegment | ParsedCodeSegment;
