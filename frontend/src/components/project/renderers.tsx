import React, { useEffect, useState } from 'react';
import { runApiRequestTest, runMemoryInterpreter } from '../../utils/api';
import { CHAPTER_PATTERN, CODE_FENCE, DESCRIPTION_SEPARATOR, SECTION_SYMBOL } from './constants';
import type {
    ApiRequestTest,
    CustomGuideSegment,
    DescriptionChapter,
    DescriptionPart,
    ExternalLinkTest,
    MemoryInterpreterTest,
    ParsedTextContent
} from './types';

const stripIndent = (value: string) => {
    const normalized = value.replace(/\r/g, '');
    const lines = normalized.split('\n');

    while (lines.length > 0 && lines[0].trim() === '') {
        lines.shift();
    }

    while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
        lines.pop();
    }

    const indents = lines
        .filter((line) => line.trim() !== '')
        .map((line) => line.match(/^(\s*)/)?.[1].length ?? 0);
    const minIndent = indents.length > 0 ? Math.min(...indents) : 0;

    return lines.map((line) => line.slice(minIndent)).join('\n');
};

const normalizeDescriptionText = (value: string) => value.replace(/\u00C2\u00A7/g, SECTION_SYMBOL);

const parseDescriptionPartsInternal = (lines: string[], images: string[], startIndex = 0) => {
    const parts: DescriptionPart[] = [];
    const currentText: string[] = [];
    let pendingImages = 0;
    let imageIndex = startIndex;

    const flushText = () => {
        const text = stripIndent(currentText.join('\n')).trim();
        if (text) {
            parts.push({ type: 'text', value: text });
        }
        currentText.length = 0;
    };

    const flushImages = () => {
        if (pendingImages === 0) {
            return;
        }

        const imageBatch = images.slice(imageIndex, imageIndex + pendingImages);
        if (imageBatch.length > 0) {
            parts.push({ type: 'images', images: imageBatch });
        }

        imageIndex += pendingImages;
        pendingImages = 0;
    };

    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        const trimmedLine = line.trim();

        if (/^%(\d+)%$/.test(trimmedLine)) {
            flushText();
            flushImages();
            parts.push({
                type: 'spacer',
                height: Number(trimmedLine.slice(1, -1)) * 1.25
            });
            continue;
        }

        if (trimmedLine === '::::::') {
            flushText();
            flushImages();

            const innerLines: string[] = [];
            index += 1;

            while (index < lines.length && lines[index].trim() !== '::::::') {
                innerLines.push(lines[index]);
                index += 1;
            }

            const parsed = parseDescriptionPartsInternal(innerLines, images, imageIndex);
            imageIndex = parsed.imageIndex;

            parts.push({
                type: 'section',
                parts: parsed.parts
            });

            continue;
        }

        if (line.includes('^^^^^^')) {
            flushText();
            flushImages();

            const title = line.split('^^^^^^')[0].trim();
            const innerLines: string[] = [];
            index += 1;

            while (index < lines.length && lines[index].trim() !== '^^^^^^') {
                innerLines.push(lines[index]);
                index += 1;
            }

            const parsed = parseDescriptionPartsInternal(innerLines, images, imageIndex);
            imageIndex = parsed.imageIndex;

            parts.push({
                type: 'collapse',
                title,
                parts: parsed.parts
            });

            continue;
        }

        if (line.trim() === DESCRIPTION_SEPARATOR) {
            flushText();
            pendingImages += 1;
            continue;
        }

        if (pendingImages > 0 && line.trim() !== '') {
            flushImages();
        }

        currentText.push(line);
    }

    flushText();
    flushImages();

    return { parts, imageIndex };
};

export const parseDescriptionParts = (description: string, images: string[]) =>
    parseDescriptionPartsInternal(normalizeDescriptionText(description).replace(/\r/g, '').split('\n'), images).parts;

export const parseDescriptionChapters = (description: string, images: string[]): DescriptionChapter[] => {
    const lines = normalizeDescriptionText(description).replace(/\r/g, '').split('\n');
    const chapterMarkers = lines
        .map((line, index) => ({ line, index, match: line.trim().match(CHAPTER_PATTERN) }))
        .filter((entry): entry is { line: string; index: number; match: RegExpMatchArray } => entry.match !== null);

    if (chapterMarkers.length === 0) {
        return [];
    }

    let imageIndex = 0;

    return chapterMarkers.map((chapter, index) => {
        const nextIndex = chapterMarkers[index + 1]?.index ?? lines.length;
        const contentLines = lines.slice(chapter.index + 1, nextIndex);
        const parsed = parseDescriptionPartsInternal(contentLines, images, imageIndex);
        imageIndex = parsed.imageIndex;

        return {
            title: chapter.match[1].trim(),
            parts: parsed.parts
        };
    });
};

const parseTextContent = (text: string): ParsedTextContent[] => {
    const content: ParsedTextContent[] = [];
    const normalizedText = normalizeDescriptionText(text);
    const pattern = new RegExp(`${CODE_FENCE}([a-zA-Z0-9_-]+)?\\n([\\s\\S]*?)${CODE_FENCE}`, 'g');
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(normalizedText)) !== null) {
        const before = normalizedText.slice(lastIndex, match.index);
        if (before.trim()) {
            content.push({ type: 'text', value: stripIndent(before) });
        }

        content.push({
            type: 'code',
            language: match[1] || '',
            value: stripIndent(match[2])
        });

        lastIndex = pattern.lastIndex;
    }

    const after = normalizedText.slice(lastIndex);
    if (after.trim()) {
        content.push({ type: 'text', value: stripIndent(after) });
    }

    return content;
};

const renderInlineText = (text: string, keyPrefix: string) => {
    const normalized = normalizeDescriptionText(text);
    const nodes: React.ReactNode[] = [];
    let italicBuffer: React.ReactNode[] = [];
    let plainBuffer = '';
    let isItalic = false;
    let index = 0;
    let nodeIndex = 0;

    const flushPlainBuffer = () => {
        if (!plainBuffer) {
            return;
        }

        const node = <React.Fragment key={`${keyPrefix}-text-${nodeIndex++}`}>{plainBuffer}</React.Fragment>;

        if (isItalic) {
            italicBuffer.push(node);
        } else {
            nodes.push(node);
        }

        plainBuffer = '';
    };

    const flushItalicBuffer = () => {
        if (italicBuffer.length === 0) {
            return;
        }

        nodes.push(
            <em key={`${keyPrefix}-italic-${nodeIndex++}`} className="italic">
                {italicBuffer}
            </em>
        );
        italicBuffer = [];
    };

    while (index < normalized.length) {
        if (normalized[index] === SECTION_SYMBOL) {
            const endIndex = normalized.indexOf(SECTION_SYMBOL, index + 1);
            if (endIndex !== -1) {
                flushPlainBuffer();
                const codeNode = (
                    <code
                        key={`${keyPrefix}-inline-${nodeIndex++}`}
                        className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[0.95em] text-slate-800"
                    >
                        {normalized.slice(index + 1, endIndex)}
                    </code>
                );

                if (isItalic) {
                    italicBuffer.push(codeNode);
                } else {
                    nodes.push(codeNode);
                }

                index = endIndex + 1;
                continue;
            }
        }

        if (normalized[index] === '*') {
            const nextChar = normalized[index + 1];
            if (nextChar && nextChar !== '\n') {
                flushPlainBuffer();
                if (isItalic) {
                    flushItalicBuffer();
                }
                isItalic = !isItalic;
                index += 1;
                continue;
            }
        }

        plainBuffer += normalized[index];
        index += 1;
    }

    flushPlainBuffer();
    if (isItalic) {
        plainBuffer = '*';
        flushItalicBuffer();
    }

    return nodes;
};

const getHeadingClassName = (level: number) => {
    if (level === 1) return 'text-3xl font-extrabold tracking-tight text-slate-900';
    if (level === 2) return 'text-2xl font-bold text-slate-900';
    if (level === 3) return 'text-xl font-bold text-slate-900';
    if (level === 4) return 'text-lg font-semibold text-slate-900';
    return 'text-base font-semibold text-slate-900';
};

const renderHeading = (level: number, content: React.ReactNode, className: string, key: string) => {
    if (level === 1) return <h1 key={key} className={className}>{content}</h1>;
    if (level === 2) return <h2 key={key} className={className}>{content}</h2>;
    if (level === 3) return <h3 key={key} className={className}>{content}</h3>;
    if (level === 4) return <h4 key={key} className={className}>{content}</h4>;
    if (level === 5) return <h5 key={key} className={className}>{content}</h5>;
    return <h6 key={key} className={className}>{content}</h6>;
};

const renderTextSection = (text: string, keyPrefix: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    const paragraphBuffer: string[] = [];

    const flushParagraph = (index: number) => {
        const paragraph = paragraphBuffer.join('\n').trim();
        if (paragraph) {
            elements.push(
                <p key={`${keyPrefix}-paragraph-${index}`} className="whitespace-pre-wrap break-words text-[1.02rem] leading-8 text-gray-800">
                    {renderInlineText(paragraph, `${keyPrefix}-paragraph-${index}`)}
                </p>
            );
        }
        paragraphBuffer.length = 0;
    };

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
            flushParagraph(index);
            const level = Math.min(headingMatch[1].length, 6);
            elements.push(
                <div key={`${keyPrefix}-heading-wrap-${index}`} className="pt-2">
                    {renderHeading(
                        level,
                        renderInlineText(headingMatch[2], `${keyPrefix}-heading-${index}`),
                        getHeadingClassName(level),
                        `${keyPrefix}-heading-${index}`
                    )}
                </div>
            );
            return;
        }

        if (trimmed === '') {
            flushParagraph(index);
            return;
        }

        paragraphBuffer.push(line);
    });

    flushParagraph(lines.length);

    return elements;
};

const renderStringToken = (token: string, keyPrefix: string) => {
    const parts = token.split(/(\{[^}]+\})/g);

    return (
        <span key={keyPrefix} className="text-emerald-700">
            {parts.map((part, index) =>
                /^\{[^}]+\}$/.test(part) ? (
                    <span key={`${keyPrefix}-escaped-${index}`} className="font-semibold text-amber-600">
                        {part}
                    </span>
                ) : (
                    <React.Fragment key={`${keyPrefix}-string-${index}`}>{part}</React.Fragment>
                )
            )}
        </span>
    );
};

const getLanguageConfig = (language: string) => {
    const normalizedLanguage = language.toLowerCase();

    if (normalizedLanguage === 'typescript' || normalizedLanguage === 'ts') {
        return {
            keywords: ['const', 'let', 'function', 'return', 'if', 'else', 'for', 'while', 'switch', 'case', 'import', 'export', 'from', 'type', 'interface', 'extends', 'implements', 'new', 'async', 'await'],
            types: ['string', 'number', 'boolean', 'unknown', 'never', 'void', 'null', 'undefined'],
            commentPattern: /(\/\/.*$)/g
        };
    }

    if (normalizedLanguage === 'javascript' || normalizedLanguage === 'js') {
        return {
            keywords: ['const', 'let', 'function', 'return', 'if', 'else', 'for', 'while', 'switch', 'case', 'import', 'export', 'from', 'new', 'async', 'await'],
            types: ['null', 'undefined'],
            commentPattern: /(\/\/.*$)/g
        };
    }

    if (normalizedLanguage === 'go' || normalizedLanguage === 'golang') {
        return {
            keywords: ['func', 'package', 'import', 'return', 'if', 'else', 'for', 'range', 'type', 'struct', 'interface', 'go', 'defer', 'var', 'const', 'map', 'chan', 'select'],
            types: ['string', 'int', 'int64', 'float64', 'bool', 'byte', 'rune', 'error'],
            commentPattern: /(\/\/.*$)/g
        };
    }

    if (normalizedLanguage === 'c') {
        return {
            keywords: ['if', 'else', 'for', 'while', 'switch', 'case', 'return', 'struct', 'enum', 'typedef', 'const', 'static', 'sizeof'],
            types: ['int', 'char', 'void', 'float', 'double', 'size_t', 'long', 'short', 'bool'],
            commentPattern: /(\/\/.*$)/g
        };
    }

    if (normalizedLanguage === 'ocaml') {
        return {
            keywords: ['let', 'rec', 'match', 'with', 'function', 'type', 'module', 'open', 'fun', 'if', 'then', 'else', 'begin', 'end'],
            types: ['int', 'string', 'bool', 'unit', 'float', 'list', 'array', 'option'],
            commentPattern: /(\(\*.*\*\))/g
        };
    }

    return {
        keywords: [],
        types: [],
        commentPattern: /(\/\/.*$)/g
    };
};

const renderGenericCodeLine = (line: string, language: string, keyPrefix: string) => {
    const config = getLanguageConfig(language);
    const tokenPattern =
        /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|0x[0-9a-fA-F]+|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_][a-zA-Z0-9_]*\b|[()[\]{};:.,<>+\-*/=%!&|]+)/g;
    const commentMatch = line.match(config.commentPattern);
    const comment = commentMatch?.[0] ?? '';
    const codePart = comment ? line.slice(0, line.indexOf(comment)) : line;
    const rendered: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenPattern.exec(codePart)) !== null) {
        if (match.index > lastIndex) {
            rendered.push(<React.Fragment key={`${keyPrefix}-plain-${lastIndex}`}>{codePart.slice(lastIndex, match.index)}</React.Fragment>);
        }

        const token = match[0];
        let node: React.ReactNode;

        if (/^"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'$/.test(token)) {
            node = <span key={`${keyPrefix}-string-${match.index}`} className="text-emerald-700">{token}</span>;
        } else if (/^0x[0-9a-fA-F]+$|^\d+(?:\.\d+)?$/.test(token)) {
            node = <span key={`${keyPrefix}-number-${match.index}`} className="text-orange-600">{token}</span>;
        } else if (/^(true|false|null|undefined)$/.test(token)) {
            node = <span key={`${keyPrefix}-bool-${match.index}`} className="font-semibold text-orange-700">{token}</span>;
        } else if (config.keywords.includes(token)) {
            node = <span key={`${keyPrefix}-keyword-${match.index}`} className="font-semibold text-rose-700">{token}</span>;
        } else if (config.types.includes(token)) {
            node = <span key={`${keyPrefix}-type-${match.index}`} className="font-semibold text-violet-700">{token}</span>;
        } else if (/^[()[\]{};:.,<>+\-*/=%!&|]+$/.test(token)) {
            node = <span key={`${keyPrefix}-symbol-${match.index}`} className="text-cyan-700">{token}</span>;
        } else {
            node = <span key={`${keyPrefix}-ident-${match.index}`} className="text-slate-700">{token}</span>;
        }

        rendered.push(node);
        lastIndex = tokenPattern.lastIndex;
    }

    if (lastIndex < codePart.length) {
        rendered.push(<React.Fragment key={`${keyPrefix}-tail`}>{codePart.slice(lastIndex)}</React.Fragment>);
    }

    if (comment) {
        rendered.push(
            <span key={`${keyPrefix}-comment`} className="italic text-slate-400">
                {comment}
            </span>
        );
    }

    return rendered;
};
const renderCustomLine = (line: string, keyPrefix: string) => {
    const tokenPattern =
        /(c\s*\[[^\]]*\]|"(?:[^"\\]|\\.)*"|\{[^}]+\}|\b(?:if|elseif|else|while|end)\b(?=\[)|\b(?:setVar|print)\b(?=\[)|\b(?:true|false)\b|\b(?:int|string|bool|nil|any)\b|&&|\|\||!|>=|<=|>|<|=|\+|-|\*|\/|\b[a-zA-Z_][a-zA-Z0-9_]*\b)/g;
    const rendered: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenPattern.exec(line)) !== null) {
        if (match.index > lastIndex) {
            rendered.push(
                <React.Fragment key={`${keyPrefix}-plain-${lastIndex}`}>{line.slice(lastIndex, match.index)}</React.Fragment>
            );
        }

        const token = match[0];
        let node: React.ReactNode;

        if (/^c\s*\[[\s\S]*\]$/.test(token)) {
            node = (
                <span key={`${keyPrefix}-comment-${match.index}`} className="italic text-slate-400">
                    {token}
                </span>
            );
        } else if (/^"(?:[^"\\]|\\.)*"$/.test(token)) {
            node = renderStringToken(token, `${keyPrefix}-string-${match.index}`);
        } else if (/^\{[^}]+\}$/.test(token)) {
            node = (
                <span key={`${keyPrefix}-escape-${match.index}`} className="font-semibold text-amber-600">
                    {token}
                </span>
            );
        } else if (/^(if|elseif|else|while|end)$/.test(token)) {
            node = (
                <span key={`${keyPrefix}-keyword-${match.index}`} className="font-semibold text-rose-700">
                    {token}
                </span>
            );
        } else if (/^(setVar|print)$/.test(token)) {
            node = (
                <span key={`${keyPrefix}-function-${match.index}`} className="font-semibold text-sky-700">
                    {token}
                </span>
            );
        } else if (/^(true|false)$/.test(token)) {
            node = (
                <span key={`${keyPrefix}-bool-${match.index}`} className="font-semibold text-orange-700">
                    {token}
                </span>
            );
        } else if (/^(int|string|bool|nil|any)$/.test(token)) {
            node = (
                <span key={`${keyPrefix}-type-${match.index}`} className="font-semibold text-violet-700">
                    {token}
                </span>
            );
        } else if (/^(&&|\|\||!|>=|<=|>|<|=|\+|-|\*|\/)$/.test(token)) {
            node = (
                <span key={`${keyPrefix}-operator-${match.index}`} className="text-cyan-700">
                    {token}
                </span>
            );
        } else {
            node = (
                <span key={`${keyPrefix}-variable-${match.index}`} className="text-blue-700">
                    {token}
                </span>
            );
        }

        rendered.push(node);
        lastIndex = tokenPattern.lastIndex;
    }

    if (lastIndex < line.length) {
        rendered.push(<React.Fragment key={`${keyPrefix}-tail`}>{line.slice(lastIndex)}</React.Fragment>);
    }

    return rendered;
};

const renderCustomCodeBlock = (code: string, keyPrefix: string) => {
    const lines = stripIndent(code).split('\n');
    const blockStack: Array<'if' | 'while'> = [];
    const indentSize = 14;
    const topGap = '1.85rem';
    const bottomGap = '1.85rem';
    const contentOffset = 18;

    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 shadow-inner">
            <div className="min-w-full font-mono text-[0.95rem] leading-8 text-slate-800">
                {lines.map((line, index) => {
                    const trimmed = line.trim();
                    const isBranch = /^(elseif|else)\[/.test(trimmed);
                    const isEnd = /^end\[\]/.test(trimmed);
                    const opensIf = /^if\[/.test(trimmed);
                    const opensWhile = /^while\[/.test(trimmed);
                    const isElseIf = /^elseif\[/.test(trimmed);
                    const isElse = /^else\[/.test(trimmed);
                    const activeDepth = blockStack.length;
                    const guideColors = ['#0ea5e9', '#8b5cf6', '#22c55e', '#f59e0b', '#f43f5e', '#14b8a6'];
                    const guideSegments: CustomGuideSegment[] = [];

                    for (let depth = 0; depth < activeDepth; depth++) {
                        guideSegments.push({
                            depth,
                            topOffset: false,
                            bottomOffset: false
                        });
                    }

                    if (opensIf || opensWhile) {
                        guideSegments.push({
                            depth: activeDepth,
                            topOffset: true,
                            bottomOffset: false
                        });
                    } else if ((isElseIf || isElse) && activeDepth > 0) {
                        guideSegments[activeDepth - 1] = {
                            depth: activeDepth - 1,
                            topOffset: true,
                            bottomOffset: false
                        };
                    } else if (isEnd && activeDepth > 0) {
                        guideSegments[activeDepth - 1] = {
                            depth: activeDepth - 1,
                            topOffset: false,
                            bottomOffset: true
                        };
                    }

                    if (opensIf) {
                        blockStack.push('if');
                    } else if (opensWhile) {
                        blockStack.push('while');
                    } else if (isEnd && activeDepth > 0) {
                        blockStack.pop();
                    }

                    return (
                        <div key={`${keyPrefix}-line-${index}`} className="relative min-h-8">
                            {guideSegments.map((segment) => (
                                <span
                                    key={`${keyPrefix}-guide-${index}-${segment.depth}`}
                                    className="absolute w-[2px] rounded-full"
                                    style={{
                                        left: `${segment.depth * indentSize + contentOffset}px`,
                                        top: segment.topOffset ? topGap : 0,
                                        bottom: segment.bottomOffset ? bottomGap : 0,
                                        backgroundColor: guideColors[segment.depth % guideColors.length],
                                        opacity: 0.8
                                    }}
                                />
                            ))}
                            <div
                                className="whitespace-pre"
                                style={{
                                    paddingLeft: `${((isBranch || isEnd ? Math.max(activeDepth - 1, 0) : activeDepth) * indentSize) + contentOffset}px`
                                }}
                            >
                                {renderCustomLine(line.trimStart(), `${keyPrefix}-${index}`)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const renderCodeBlock = (code: string, language: string, keyPrefix: string) => {
    if (language === 'custom') {
        return renderCustomCodeBlock(code, keyPrefix);
    }

    return (
        <pre className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 font-mono text-[0.95rem] leading-8 text-slate-800">
            <code>
                {stripIndent(code).split('\n').map((line, index) => (
                    <div key={`${keyPrefix}-generic-${index}`}>{renderGenericCodeLine(line, language, `${keyPrefix}-${index}`)}</div>
                ))}
            </code>
        </pre>
    );
};

export const renderDescriptionPart = (part: DescriptionPart, keyPrefix: string, language: string, setPreviewImg: (img: string) => void) => {
    if (part.type === 'text') {
        return (
            <div key={keyPrefix} className="rounded-2xl bg-gray-50 p-5 shadow">
                {parseTextContent(part.value).map((segment, segmentIndex) =>
                    segment.type === 'text' ? (
                        <div key={`${keyPrefix}-segment-${segmentIndex}`} className="space-y-4">
                            {renderTextSection(segment.value, `${keyPrefix}-segment-${segmentIndex}`)}
                        </div>
                    ) : (
                        <div key={`${keyPrefix}-code-${segmentIndex}`}>
                            {renderCodeBlock(segment.value, segment.language, `${keyPrefix}-code-${segmentIndex}`)}
                        </div>
                    )
                )}
            </div>
        );
    }

    if (part.type === 'images') {
        return (
            <div
                key={keyPrefix}
                className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2"
            >
                {part.images.map((img, idx) => (
                    <button
                        key={`${keyPrefix}-${img}-${idx}`}
                        type="button"
                        className="overflow-hidden rounded-2xl border bg-white shadow transition-transform hover:scale-[1.01]"
                        onClick={() => setPreviewImg(img)}
                    >
                        <img src={img} alt={`project-img-${keyPrefix}-${idx}`} className="aspect-[4/3] h-full w-full object-cover" />
                    </button>
                ))}
            </div>
        );
    }

    if (part.type === 'spacer') {
        return <div key={keyPrefix} aria-hidden="true" style={{ height: `${part.height}rem` }} />;
    }

    if (part.type === 'section') {
        return (
            <section key={keyPrefix} className="w-full space-y-6 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
                {part.parts.map((innerPart, innerIndex) =>
                    renderDescriptionPart(innerPart, `${keyPrefix}-section-${innerIndex}`, language, setPreviewImg)
                )}
            </section>
        );
    }

    return (
        <details key={keyPrefix} className="group w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-gray-50 px-5 py-4 text-base font-semibold text-gray-800 marker:content-none">
                <span>
                    {part.title ? renderInlineText(part.title, `${keyPrefix}-title`) : language === 'fr' ? 'Voir plus' : 'Show more'}
                </span>
                <span className="text-slate-500 transition-transform duration-200 group-open:rotate-90">?</span>
            </summary>
            <div className="space-y-6 border-t border-gray-100 px-5 py-5">
                {part.parts.map((innerPart, innerIndex) =>
                    renderDescriptionPart(innerPart, `${keyPrefix}-inner-${innerIndex}`, language, setPreviewImg)
                )}
            </div>
        </details>
    );
};

const REQUEST_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;

const stringifyPayload = (value: unknown) => {
    if (typeof value === 'string') {
        try {
            return JSON.stringify(JSON.parse(value), null, 2);
        } catch {
            return value;
        }
    }

    return JSON.stringify(value, null, 2);
};

const coerceScalarValue = (value: string) => {
    const trimmed = value.trim();

    if (/^(true|false)$/i.test(trimmed)) {
        return trimmed.toLowerCase() === 'true';
    }

    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
        return Number(trimmed);
    }

    return trimmed;
};

type KeyValueEntry = {
    key: string;
    value: string;
};

const parseRouteParamNames = (route: string) => {
    const matches = route.match(/:([a-zA-Z0-9_]+)/g) ?? [];
    return matches.map((match) => match.slice(1));
};

const parseKeyValueEntries = (value: string): KeyValueEntry[] =>
    value
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const separatorIndex = line.indexOf(':');
            if (separatorIndex === -1) {
                return { key: line.trim(), value: '' };
            }

            return {
                key: line.slice(0, separatorIndex).trim(),
                value: line.slice(separatorIndex + 1).trim()
            };
        });

const keyValueEntriesToObject = (entries: KeyValueEntry[], fieldLabel: string) =>
    entries.reduce<Record<string, string | number | boolean>>((accumulator, entry) => {
        const key = entry.key.trim();
        const value = entry.value.trim();

        if (!key && !value) {
            return accumulator;
        }

        if (!key) {
            throw new Error(fieldLabel);
        }

        accumulator[key] = coerceScalarValue(value);
        return accumulator;
    }, {});

const parseJsonInput = (value: string, fieldLabel: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
        return {};
    }

    try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
            throw new Error(fieldLabel);
        }

        return parsed as Record<string, string | number | boolean>;
    } catch {
        throw new Error(fieldLabel);
    }
};

const renderJsonLine = (line: string, keyPrefix: string) => {
    const tokenPattern = /("(?:[^"\\]|\\.)*")(\s*:)?|\b-?\d+(?:\.\d+)?\b|\btrue\b|\bfalse\b|\bnull\b|[{}\[\],:]/g;
    const rendered: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenPattern.exec(line)) !== null) {
        if (match.index > lastIndex) {
            rendered.push(<React.Fragment key={`${keyPrefix}-plain-${lastIndex}`}>{line.slice(lastIndex, match.index)}</React.Fragment>);
        }

        const [token, stringToken, hasColon] = match;

        if (stringToken) {
            rendered.push(
                <span key={`${keyPrefix}-string-${match.index}`} className={hasColon ? 'text-sky-700' : 'text-emerald-700'}>
                    {stringToken}
                </span>
            );

            if (hasColon) {
                rendered.push(
                    <span key={`${keyPrefix}-colon-${match.index}`} className="text-cyan-700">
                        :
                    </span>
                );
            }
        } else if (/^-?\d+(?:\.\d+)?$/.test(token)) {
            rendered.push(
                <span key={`${keyPrefix}-number-${match.index}`} className="text-orange-600">
                    {token}
                </span>
            );
        } else if (/^(true|false|null)$/.test(token)) {
            rendered.push(
                <span key={`${keyPrefix}-literal-${match.index}`} className="font-semibold text-fuchsia-700">
                    {token}
                </span>
            );
        } else {
            rendered.push(
                <span key={`${keyPrefix}-symbol-${match.index}`} className="text-slate-500">
                    {token}
                </span>
            );
        }

        lastIndex = tokenPattern.lastIndex;
    }

    if (lastIndex < line.length) {
        rendered.push(<React.Fragment key={`${keyPrefix}-tail`}>{line.slice(lastIndex)}</React.Fragment>);
    }

    return rendered;
};

const renderJsonPreview = (value: string, keyPrefix: string, emptyLabel: string) => {
    const content = value.trim();

    return (
        <pre className="min-h-[10rem] whitespace-pre-wrap break-words rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-7 text-slate-800">
            {content
                ? content.split('\n').map((line, index) => <div key={`${keyPrefix}-line-${index}`}>{renderJsonLine(line, `${keyPrefix}-${index}`)}</div>)
                : emptyLabel}
        </pre>
    );
};

const JsonCodeEditor: React.FC<{
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    editorKey: string;
    minHeightClassName?: string;
}> = ({ value, onChange, placeholder, editorKey, minHeightClassName = 'min-h-[14rem]' }) => (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 ${minHeightClassName}`}>
        <pre className="pointer-events-none whitespace-pre-wrap break-words px-4 py-4 font-mono text-sm leading-7 text-slate-800">
            {value.trim()
                ? value.split('\n').map((line, index) => <div key={`${editorKey}-line-${index}`}>{renderJsonLine(line, `${editorKey}-${index}`)}</div>)
                : placeholder}
        </pre>
        <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            spellCheck={false}
            className={`absolute inset-0 h-full w-full resize-none bg-transparent px-4 py-4 font-mono text-sm leading-7 text-transparent caret-slate-800 outline-none selection:bg-blue-200 ${minHeightClassName}`}
        />
    </div>
);

export const MemoryInterpreterTestPanel: React.FC<{
    test: MemoryInterpreterTest;
    language: string;
}> = ({ test, language }) => {
    const [code, setCode] = useState(language === 'fr' && test.initialCode_fr ? test.initialCode_fr : test.initialCode);
    const [stdout, setStdout] = useState('');
    const [stderr, setStderr] = useState('');
    const [loading, setLoading] = useState(false);
    const [requestError, setRequestError] = useState('');

    useEffect(() => {
        setCode(language === 'fr' && test.initialCode_fr ? test.initialCode_fr : test.initialCode);
        setStdout('');
        setStderr('');
        setRequestError('');
    }, [language, test]);

    const runTest = async () => {
        setLoading(true);
        setRequestError('');

        try {
            const result = await runMemoryInterpreter(test.endpoint, code);
            setStdout(result.stdout);
            setStderr(result.stderr);
        } catch (error) {
            const backendMessage =
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                typeof error.response === 'object' &&
                error.response !== null &&
                'data' in error.response &&
                typeof error.response.data === 'object' &&
                error.response.data !== null &&
                'message' in error.response.data &&
                typeof error.response.data.message === 'string'
                    ? error.response.data.message
                    : '';
            const message =
                backendMessage ||
                (error instanceof Error
                    ? error.message
                    : language === 'fr'
                      ? "Impossible d'exécuter le test."
                      : 'Unable to run the test.');

            setStdout('');
            setStderr('');
            setRequestError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-5">
            <div className="rounded-2xl bg-gray-50 p-5 shadow">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">
                            {language === 'fr' ? test.title_fr : test.title}
                        </h3>
                        <p className="text-sm text-slate-500">
                            {language === 'fr'
                                ? 'écris du code puis exécute-le avec le backend local.'
                                : 'Write code, then run it with the local backend.'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={runTest}
                        disabled={loading}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                            loading ? 'cursor-not-allowed bg-slate-300 text-slate-600' : 'bg-primary text-white hover:bg-blue-600'
                        }`}
                    >
                        {loading ? (language === 'fr' ? 'Exécution...' : 'Running...') : language === 'fr' ? 'Exécuter' : 'Run'}
                    </button>
                </div>
                <div className="grid gap-5 xl:grid-cols-2">
                    <div className="space-y-3">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                            {language === 'fr' ? 'Code' : 'Code'}
                        </p>
                        <textarea
                            value={code}
                            onChange={(event) => setCode(event.target.value)}
                            spellCheck={false}
                            className="h-[24rem] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-4 font-mono text-sm leading-7 text-slate-800 outline-none transition-colors focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-3">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                            {language === 'fr' ? 'Aperçu coloré' : 'Colorized preview'}
                        </p>
                        <div className="max-h-[24rem] overflow-auto rounded-2xl border border-slate-200 bg-white">
                            {renderCodeBlock(code, 'custom', 'memory-test-preview')}
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid gap-5 xl:grid-cols-2">
                <div className="rounded-2xl bg-gray-50 p-5 shadow">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">stdout</p>
                    <pre className="min-h-[10rem] whitespace-pre-wrap break-words rounded-2xl border border-slate-200 bg-white p-4 font-mono text-sm leading-7 text-slate-800">
                        {stdout || (language === 'fr' ? 'Aucune sortie.' : 'No output.')}
                    </pre>
                </div>
                <div className="rounded-2xl bg-gray-50 p-5 shadow">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">stderr</p>
                    <pre className="min-h-[10rem] whitespace-pre-wrap break-words rounded-2xl border border-slate-200 bg-white p-4 font-mono text-sm leading-7 text-rose-700">
                        {requestError || stderr || (language === 'fr' ? 'Aucune erreur.' : 'No error.')}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export const ApiRequestTestPanel: React.FC<{
    test: ApiRequestTest;
    language: string;
}> = ({ test, language }) => {
    const initialRouteParamValues = parseKeyValueEntries(test.initialParams ?? '').reduce<Record<string, string>>((accumulator, entry) => {
        if (entry.key.trim()) {
            accumulator[entry.key.trim()] = entry.value;
        }
        return accumulator;
    }, {});
    const [method, setMethod] = useState<ApiRequestTest['initialMethod']>(test.initialMethod);
    const [route, setRoute] = useState(test.initialRoute);
    const [routeParams, setRouteParams] = useState<Record<string, string>>({});
    const [queryEntries, setQueryEntries] = useState<KeyValueEntry[]>([]);
    const [body, setBody] = useState(test.initialBody ?? '{}');
    const [loading, setLoading] = useState(false);
    const [requestError, setRequestError] = useState('');
    const [responseStatus, setResponseStatus] = useState<number | null>(null);
    const [responseUrl, setResponseUrl] = useState('');
    const [responsePayload, setResponsePayload] = useState('');
    const routeParamNames = parseRouteParamNames(route);
    const hasQuerySection = queryEntries.length > 0 || (test.initialQueries ?? '').trim() !== '';

    useEffect(() => {
        setMethod(test.initialMethod);
        setRoute(test.initialRoute);
        setRouteParams({});
        setQueryEntries(parseKeyValueEntries(test.initialQueries ?? ''));
        setBody(test.initialBody ?? '{}');
        setLoading(false);
        setRequestError('');
        setResponseStatus(null);
        setResponseUrl('');
        setResponsePayload('');
    }, [language, test]);

    useEffect(() => {
        setRouteParams((currentValues) =>
            routeParamNames.reduce<Record<string, string>>((accumulator, paramName) => {
                accumulator[paramName] = currentValues[paramName] ?? '';
                return accumulator;
            }, {})
        );
    }, [route]);

    const runRequest = async () => {
        setLoading(true);
        setRequestError('');

        try {
            const parsedParams = keyValueEntriesToObject(
                routeParamNames.map((paramName) => ({ key: paramName, value: routeParams[paramName] ?? '' })),
                language === 'fr' ? 'Les params doivent etre au format cle: valeur.' : 'Params must use the key: value format.'
            );
            const parsedQueries = keyValueEntriesToObject(
                queryEntries,
                language === 'fr' ? 'Les queries doivent etre au format cle: valeur.' : 'Queries must use the key: value format.'
            );
            const parsedBody =
                method === 'GET'
                    ? undefined
                    : parseJsonInput(
                          body,
                          language === 'fr' ? 'Le body doit etre un objet JSON.' : 'Body must be a JSON object.'
                      );
            const result = await runApiRequestTest(test.endpoint, {
                baseUrl: test.baseUrl,
                method,
                route,
                params: parsedParams,
                query: parsedQueries,
                body: parsedBody
            });

            setResponseStatus(result.status);
            setResponseUrl(result.url);
            setResponsePayload(stringifyPayload(result.data));
        } catch (error) {
            const backendMessage =
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                typeof error.response === 'object' &&
                error.response !== null &&
                'data' in error.response &&
                typeof error.response.data === 'object' &&
                error.response.data !== null &&
                'message' in error.response.data &&
                typeof error.response.data.message === 'string'
                    ? error.response.data.message
                    : '';
            const message =
                backendMessage ||
                (error instanceof Error
                    ? error.message
                    : language === 'fr'
                      ? "Impossible d'executer la requete."
                      : 'Unable to run the request.');

            setResponseStatus(null);
            setResponseUrl('');
            setResponsePayload('');
            setRequestError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-5">
            <div className="rounded-2xl bg-gray-50 p-5 shadow">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">
                            {language === 'fr' ? test.title_fr : test.title}
                        </h3>
                        <p className="text-sm text-slate-500">
                            {language === 'fr'
                                ? 'Teste les endpoints localement en choisissant methode, route, params, queries et body.'
                                : 'Test local endpoints by choosing the method, route, params, queries, and body.'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={runRequest}
                        disabled={loading}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                            loading ? 'cursor-not-allowed bg-slate-300 text-slate-600' : 'bg-primary text-white hover:bg-blue-600'
                        }`}
                    >
                        {loading ? (language === 'fr' ? 'Execution...' : 'Running...') : language === 'fr' ? 'Executer' : 'Run'}
                    </button>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                    <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-[10rem_1fr] sm:items-center">
                            <label className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                                {language === 'fr' ? 'Methode' : 'Method'}
                            </label>
                            <select
                                value={method}
                                onChange={(event) => setMethod(event.target.value as ApiRequestTest['initialMethod'])}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-blue-500"
                            >
                                {REQUEST_METHODS.map((requestMethod) => (
                                    <option key={requestMethod} value={requestMethod}>
                                        {requestMethod}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-[10rem_1fr] sm:items-center">
                            <label className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                                Route
                            </label>
                            <input
                                value={route}
                                onChange={(event) => setRoute(event.target.value)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-blue-500"
                            />
                        </div>
                        <div className="space-y-3">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Params</p>
                            {routeParamNames.length > 0 ? (
                                <div className="space-y-3">
                                    {routeParamNames.map((paramName) => (
                                        <div key={paramName} className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:items-center">
                                            <label className="text-sm font-semibold text-slate-700">{paramName}</label>
                                            <input
                                                value={routeParams[paramName] ?? ''}
                                                onChange={(event) =>
                                                    setRouteParams((currentValues) => ({
                                                        ...currentValues,
                                                        [paramName]: event.target.value
                                                    }))
                                                }
                                                placeholder={
                                                    initialRouteParamValues[paramName] ||
                                                    (paramName === 'movie' ? 'Avatar' : paramName === 'pokemon' ? 'pikachu' : paramName)
                                                }
                                                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-blue-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-500">
                                    {language === 'fr'
                                        ? 'Aucun parametre detecte dans la route.'
                                        : 'No route parameters detected.'}
                                </div>
                            )}
                        </div>
                        {hasQuerySection && (
                            <div className="space-y-3">
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Queries</p>
                                <div className="space-y-3">
                                    {queryEntries.map((entry, index) => (
                                        <div key={`query-entry-${index}`} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
                                            <input
                                                value={entry.key}
                                                onChange={(event) =>
                                                    setQueryEntries((currentEntries) =>
                                                        currentEntries.map((currentEntry, currentIndex) =>
                                                            currentIndex === index ? { ...currentEntry, key: event.target.value } : currentEntry
                                                        )
                                                    )
                                                }
                                                placeholder={language === 'fr' ? 'cle' : 'key'}
                                                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-blue-500"
                                            />
                                            <input
                                                value={entry.value}
                                                onChange={(event) =>
                                                    setQueryEntries((currentEntries) =>
                                                        currentEntries.map((currentEntry, currentIndex) =>
                                                            currentIndex === index ? { ...currentEntry, value: event.target.value } : currentEntry
                                                        )
                                                    )
                                                }
                                                placeholder={language === 'fr' ? 'valeur' : 'value'}
                                                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-blue-500"
                                            />
                                            <button
                                                type="button"
                                                aria-label={language === 'fr' ? 'Retirer cette query' : 'Remove this query'}
                                                onClick={() => setQueryEntries((currentEntries) => currentEntries.filter((_, currentIndex) => currentIndex !== index))}
                                                className="inline-flex h-11 w-11 items-center justify-center self-center rounded-xl border border-rose-200 bg-rose-50 text-lg text-rose-700 transition-colors hover:bg-rose-100"
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setQueryEntries((currentEntries) => [...currentEntries, { key: '', value: '' }])}
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                                    >
                                        {language === 'fr' ? 'Ajouter une query' : 'Add query'}
                                    </button>
                                </div>
                            </div>
                        )}
                        {method !== 'GET' && (
                            <div className="space-y-3">
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Body</p>
                                <JsonCodeEditor
                                    value={body}
                                    onChange={setBody}
                                    placeholder={language === 'fr' ? 'Aucun body.' : 'No body.'}
                                    editorKey="api-request-body-editor"
                                    minHeightClassName="min-h-[14rem]"
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                                {language === 'fr' ? 'Base URL' : 'Base URL'}
                            </p>
                            <code className="break-all text-sm text-slate-800">{test.baseUrl}</code>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Status</p>
                            <p className="text-sm text-slate-800">
                                {responseStatus !== null ? responseStatus : language === 'fr' ? 'Aucune reponse.' : 'No response yet.'}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">URL</p>
                            <code className="break-all text-sm text-slate-800">
                                {responseUrl || (language === 'fr' ? 'Aucune URL resolue.' : 'No resolved URL yet.')}
                            </code>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                                {language === 'fr' ? 'Resultat' : 'Result'}
                            </p>
                            {requestError ? (
                                <pre className="min-h-[20rem] whitespace-pre-wrap break-words rounded-2xl border border-rose-200 bg-rose-50 p-4 font-mono text-sm leading-7 text-rose-700">
                                    {requestError}
                                </pre>
                            ) : (
                                renderJsonPreview(
                                    responsePayload,
                                    'api-response-preview',
                                    language === 'fr' ? 'Aucune reponse.' : 'No response yet.'
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ExternalLinkTestPanel: React.FC<{
    test: ExternalLinkTest;
    language: string;
}> = ({ test, language }) => {
    const label = language === 'fr' ? test.buttonLabel_fr : test.buttonLabel;

    return (
        <div className="w-full space-y-5">
            <div className="rounded-2xl bg-gray-50 p-5 shadow">
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-slate-800">
                        {language === 'fr' ? test.title_fr : test.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                        {language === 'fr'
                            ? "Ce test ouvre directement l'invitation Discord du bot."
                            : 'This test opens the bot invitation link directly.'}
                    </p>
                    <a
                        href={test.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                    >
                        {label}
                    </a>
                </div>
            </div>
        </div>
    );
};

export const scrollInfoContainerToChapter = (container: HTMLDivElement | null, chapterIndex: number) => {
    if (!container) {
        return;
    }

    const target = container.querySelector<HTMLElement>(`[data-chapter-index="${chapterIndex}"]`);
    if (!target) {
        return;
    }

    const targetTop = target.offsetTop - container.offsetTop;
    const maxScrollTop = Math.max(container.scrollHeight - container.clientHeight, 0);
    const nextScrollTop = Math.min(Math.max(targetTop, 0), maxScrollTop);

    container.scrollTo({
        top: nextScrollTop,
        behavior: 'smooth'
    });
};
