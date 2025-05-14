import { dedent } from './dedent';
import { DocumentType } from './document.type';

export function serializeDocument(document: DocumentType) {
    const textSections: string[] = [];

    for (const section of document.documentContentData) {
        if (section.type === 'text') {
            textSections.push(`[${section.id}] ${dedent(section.content)}`);
        }
        if (section.type === 'header') {
            textSections.push(`# [${section.id}] ${dedent(section.content)}`);
        }
        if (section.type === 'header2') {
            textSections.push(`## [${section.id}] ${dedent(section.content)}`);
        }
    }

    const serializedDocumentBody = textSections.join('\n');

    return `### [${document.id}] ${document.name}
\`\`\`
${serializedDocumentBody}
\`\`\`
`;
}
