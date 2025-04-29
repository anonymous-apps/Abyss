import { Thread } from '../../../thread/thread';

import { Intelligence } from '../../../..';
import { AIProviderStatic } from '../../types';

export interface StaticLanguageModelOptions {
    thread: Thread;
    intelligence: Intelligence<AIProviderStatic>;
}
