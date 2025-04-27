import { Chat } from './chat/chat';
import { Graph } from './graph/graph';
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

    // Chats
    public abstract saveChat(chat: Chat): Promise<void>;
    public abstract loadChat(id: string): Promise<Chat>;

    // AI Providers
    public abstract saveIntelligence(aiProvider: Intelligence): Promise<void>;
    public abstract loadIntelligence(id: string): Promise<Intelligence>;

    // Graphs
    public abstract saveGraph(graph: Graph): Promise<void>;
    public abstract loadGraph(id: string): Promise<Graph>;
}
