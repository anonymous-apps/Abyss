import type { ReferencedMessageThreadRecord } from '@abyss/records';

export interface StaticLanguageModelOptions {
    thread: ReferencedMessageThreadRecord;
    response: string;
}
