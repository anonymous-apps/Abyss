import { Thread } from './thread/thread';

/**
 * Represents a connection to the underlying database
 * The specifics of the database are irrelevant to the rest of the application
 */
export abstract class DataInterface {
    // Threads
    public abstract saveThread(thread: Thread): Promise<void>;
    public abstract loadThread(id: string): Promise<Thread>;
}
