import { Intelligence } from './intelligence/intelligence';
import { Thread } from './thread/thread';

/**
 * Represents a connection to the underlying database
 * The specifics of the database are irrelevant to the rest of the application
 */
export abstract class DataInterface {
    // Threads
    public abstract saveThread(thread: Thread): Promise<void>;
    public abstract loadThread(id: string): Promise<Thread>;

    // AI Providers
    public abstract saveIntelligence(aiProvider: Intelligence): Promise<void>;
    public abstract loadIntelligence(id: string): Promise<Intelligence>;
}
