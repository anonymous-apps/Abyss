import { ChatThread } from '../../constructs';
import { LanguageModel } from '../../models/language-model';
import { StorageController } from '../../storage';

export interface StreamTextOptions {
    model: LanguageModel;
    thread: ChatThread;
    cache?: StorageController;
}

export interface StreamTextResult {
    thread: ChatThread;
    text: string;
}
